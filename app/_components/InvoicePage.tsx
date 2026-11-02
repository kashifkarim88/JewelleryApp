"use client";

import React from 'react';
import { useInvoiceLogic } from '../hooks/useInvoiceLogic';
import { SectionHeader } from './_billing/SectionHeader';
import { BillingSummary } from './_billing/BillingSummary';
import { PrintInvoice } from './PrintInvoice';
import DynamicMetalRateModal from './_billing/billingmodels/DynamicMetalRateModal';
import { CustomerSearchSection } from './_billing/invoicemodels/CustomerSearchSection';
import { CartList } from './_billing/invoicemodels/CartList';

export default function InvoicePage() {
    const {
        billing,
        editId, setEditId,
        printData,
        showLoader,
        isPrinting,
        errorMessage, setErrorMessage,
        isModalOpen, tempRate, setTempRate, pendingItem, rateTarget,
        handleAddProduct, confirmDynamicRate, closeModal,
        handlePrint, handleClearAll,
    } = useInvoiceLogic();

    const {
        customer, setCustomer, itemInput, setItemInput, cart,
        updateItemDetail, removeItem, calculateItemPrice, calculateAddons,
        discount, extraDiscount, setExtraDiscount, exchangeValue, setExchangeValue,
        advance, setAdvance, finalTotal, updateNestedDetail,
    } = billing;

    // Use printData items when available, fallback to active cart
    const activePrintItems = printData?.items || cart;

    /*
     * Prepare the financial values for the print invoice.
     *
     * Full invoice:
     *   - Uses the complete billing totals.
     *
     * Single item:
     *   - Uses only the selected item's discount, advance and total.
     *   - Exchange value is 0 because exchange belongs to the full bill.
     *   - Extra/global discount is not applied to a single-item print.
     */
    const printDiscount = printData?.isSingle
        ? Number(activePrintItems[0]?.discount || 0)
        : Number(discount || 0);

    const printExchangeValue = printData?.isSingle
        ? 0
        : Number(exchangeValue || 0);

    const printAdvance = printData?.isSingle
        ? Number(activePrintItems[0]?.advance || 0)
        : Number(advance || 0);

    const printFinalTotal = printData?.isSingle
        ? Math.max(
            Number(activePrintItems[0]?.peritemTotal ?? 0),
            0
        )
        : Number(finalTotal || 0);

    return (
        <>
            {isPrinting && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm print:hidden">
                    <div className="w-[320px] rounded-2xl bg-white p-7 shadow-2xl text-center">
                        <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Generating Invoice...
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Please wait while we generate your invoice
                            and prepare it for printing.
                        </p>

                        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500"></span>
                            <span>Processing...</span>
                        </div>
                    </div>
                </div>
            )}

            <PrintInvoice
                customer={customer}
                cart={activePrintItems.map((item) => ({
                    ...item,
                    itemTotal: calculateItemPrice(item),
                    peritemTotal: calculateItemPrice(item),
                    stonesTotal: calculateAddons(item),
                }))}
                discount={printDiscount}
                exchangeValue={printExchangeValue}
                advance={printAdvance}
                finalTotal={printFinalTotal}
                billSerialNumber={printData?.billSerialNumber || ""}
            />

            <div className="print:hidden min-h-screen bg-[#F8FAFC] p-4 lg:p-8 text-slate-900 antialiased">
                <div className="max-w-[1600px] mx-auto">
                    <SectionHeader />

                    <div className="flex flex-col lg:flex-row gap-6 items-start mt-8">
                        {/* LEFT COLUMN */}
                        <div className="flex-[3] w-full space-y-6">
                            <CustomerSearchSection
                                customer={customer}
                                setCustomer={setCustomer}
                                itemInput={itemInput}
                                setItemInput={setItemInput}
                                showLoader={showLoader}
                                errorMessage={errorMessage}
                                setErrorMessage={setErrorMessage}
                                onAddProduct={handleAddProduct}
                            />

                            <CartList
                                cart={cart}
                                editId={editId}
                                setEditId={setEditId}
                                updateItemDetail={updateItemDetail}
                                removeItem={removeItem}
                                updateNestedDetail={updateNestedDetail}
                                calculateItemPrice={calculateItemPrice}
                                calculateAddons={calculateAddons}
                                onClearAll={handleClearAll}
                                onPrintSingle={(item) => handlePrint([item], true)}
                            />
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="w-full lg:w-80 sticky top-8 flex-shrink-0">
                            <BillingSummary
                                cart={cart}
                                discount={discount}
                                itemDiscountsSum={billing.itemDiscountsSum}
                                extraDiscount={extraDiscount}
                                setExtraDiscount={setExtraDiscount}
                                exchangeValue={exchangeValue}
                                setExchangeValue={setExchangeValue}
                                advance={advance}
                                setAdvance={setAdvance}
                                finalTotal={finalTotal}
                                onPrintFull={() => handlePrint(cart, false)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* DYNAMIC METALS RATE MODAL PORTAL */}
            {isModalOpen && rateTarget && (
                <DynamicMetalRateModal
                    isOpen={isModalOpen}
                    tempRate={tempRate}
                    pendingItem={pendingItem}
                    rateLabel={rateTarget.label}
                    setTempRate={setTempRate}
                    onClose={closeModal}
                    onConfirm={confirmDynamicRate}
                />
            )}
        </>
    );
}