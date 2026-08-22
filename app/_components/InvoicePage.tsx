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

    return (
        <>
            <PrintInvoice
                customer={customer}
                cart={activePrintItems.map((item) => ({
                    ...item,
                    itemTotal: calculateItemPrice(item),
                    stonesTotal: calculateAddons(item),
                }))}
                discount={printData?.isSingle ? 0 : discount}
                exchangeValue={exchangeValue}
                advance={advance}
                finalTotal={finalTotal}
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