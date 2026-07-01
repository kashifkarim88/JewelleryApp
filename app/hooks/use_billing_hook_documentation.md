===============================================================================
OFFICIAL DEVELOPER LOGIC REFERENCE: useBilling REFERENCE MANUAL
===============================================================================

This documentation provides an exhaustive, granular breakdown of the state, 
reducer patterns, pipeline methods, and mathematical formula engines driving 
the useBilling React hook.

-------------------------------------------------------------------------------
1. TYPE CONTRACTS & DATA ARCHITECTURE
-------------------------------------------------------------------------------

DetailSection
-------------
Represents sub-components attached to a primary catalog layout item (such as 
precious gemstones, micro-set diamonds, or accent beads).
- id, name: Structural record identifiers.
- weight, rate: Used directly to calculate the base value of loose materials.
- price: A static price override for the calculated entry row.
- color, clarity, cut: Categorization strings for diamonds.
- squantity, dquantity: Count tracking for stones and diamonds respectively.

CartItem
--------
The complete schema for a product added to the active transaction matrix.
- itemCode: Unique stock identifier (used for duplication matching rules).
- metal, carat: Controls the rate selection tree logic.
- netWeight: The metal mass prior to labor, wastage, or settings calculations.
- wastagePercent: Added directly to the net weight to compute structural loss.
- making: Labor fee applied to the production of the item.
- discount, advance: Granular item-specific financial adjustments.
- diamondDetails, stoneDetails: Sub-arrays handled by nested logic routes.

BillingState
------------
The singular source of truth managed by the state engine.
- customer: Structured client object profile metadata.
- exchangeValue: Valuation applied for customer gold or trade-ins.
- extraDiscount: Store-wide global deduction value.
- advance: Global advance/deposit down-payments.
- cart: Current collection array of active CartItem records.


-------------------------------------------------------------------------------
2. THE STATE REDUCER MACHINE ENGINE (billingReducer)
-------------------------------------------------------------------------------
The hook handles mutations through a unified switch-case state reducer engine. 
This prevents component layout shifts, frame skipping, and focus dropouts.

Action Processing Map:
---------------------
* SET_CUSTOMER: 
  Shallowly merges new profile parameters without losing unedited fields.
  Formula: state.customer = { ...state.customer, ...action.payload }

* SET_EXCHANGE_VALUE / SET_EXTRA_DISCOUNT / SET_ADVANCE / SET_CART: 
  Overwrites target fields directly with incoming payload values.

* ADD_CART_ITEM: 
  Validates if the new item code already exists in the cart array. If it is 
  a duplicate, it blocks insertion. If unique, it prepends the new formatted 
  item to the top of the array: [newProduct, ...existingCart].

* REMOVE_CART_ITEM: 
  Filters out a line item based on its explicit array index.

* UPDATE_ITEM_DETAIL: 
  Mutates specific parameters on a cart row. If a nested "field" is provided, 
  it maps safely into sub-objects. Otherwise, it updates the parent property 
  row directly (e.g., editing the primary making charge or item weight).

* UPDATE_NESTED_DETAIL: 
  Deeply targets sub-collections. Isolates a parent cart item by index, clones 
  its inner target array (stoneDetails or diamondDetails), updates the specified 
  field at a precise nested row index, and saves the modified state back into 
  the cart array without triggering global components re-renders.


-------------------------------------------------------------------------------
3. CORE MATHEMATICAL FORMULAS & CALCULATION LOGIC
-------------------------------------------------------------------------------

A. Fast Floating-Point Precision Helper
----------------------------------------
To resolve floating-point arithmetic errors inherent to JavaScript (e.g., 
0.1 + 0.2 = 0.30000000000000004), the formatFinancial utility standardizes 
computations to two decimal places.

Formula:
FormattedValue = Math.round((Value + Number.EPSILON) * 100) / 100

B. Add-On Evaluation (calculateAddons)
--------------------------------------
Aggregates the individual price metrics across loose stones, diamonds, and beads 
embedded within a product row.

Formula:
Stones Total   = Sum of all stone.price values (defaults to 0 if null)
Diamonds Total = Sum of all diamond.price values (defaults to 0 if null)
Beads Price    = item.beadDetails.price value (defaults to 0 if null)

Total Addon Price = Stones Total + Diamonds Total + Beads Price

C. Live Metal Rate Selection Logic
----------------------------------
The function matches item parameters against live hook state entries to resolve 
the active pricing bracket:
- If metal is "silver"    -> Uses rateSilver
- If metal is "platinum"  -> Uses ratePlatinum
- If metal is "palladium" -> Uses ratePalladium (Sets isPerGram to false)
- If metal is "gold":
    - Carat contains "24" -> Uses rate24ct
    - Carat contains "22" -> Uses rate22ct
    - Carat contains "21" -> Uses rate21ct
    - Carat contains "20" -> Uses rate20ct
    - Carat contains "18" -> Uses rate18ct
    - Carat contains "14" -> Uses rate14ct
    - Alternate/Fallback  -> Uses rate24ct

D. Gram Weight Unit Scaling Conversion
--------------------------------------
Traditional South Asian and Middle Eastern precious metal inventories track 
spot market prices using Tola metrics. The hook scales calculations to a clean 
per-gram denominator if the target material uses standard per-gram pricing.

Formula:
If isPerGram is true:
    RatePerGram = Active Resolved Metal Rate / 11.664
If isPerGram is false:
    RatePerGram = Active Resolved Metal Rate

E. Item Base Cost Engine (calculateItemBasePrice)
--------------------------------------------------
Computes the baseline structural material and labor production cost of a 
jewelry piece prior to assessing additional loose stones or components.

Formula:
Total Weight    = Net Weight + ((Wastage Percent * Net Weight) / 100)
Raw Metal Cost  = Total Weight * RatePerGram
Base Item Cost  = Raw Metal Cost + Making Charge

F. Subtotal Calculation Aggregate (subTotal)
---------------------------------------------
Accumulates the combined gross raw materials, labor overhead, and total gemstone 
components value for every product currently in the cart.

Formula:
Item Row Cost   = calculateItemBasePrice(item) + calculateAddons(item)
Gross Subtotal  = Sum of all Item Row Costs in the cart

G. Inline Row Presentation Pricing (calculateItemPrice)
-------------------------------------------------------
Calculates the clear visibility price displayed directly on each individual line 
item row inside the shopping cart UI wrapper.

Formula:
Row Gross Price = Base Item Cost + Total Addon Price
Row Final Price = Row Gross Price - Item Row Discount - Item Row Advance

* Note: Returns 0 if calculation resolves to a negative value.

H. Aggregated Bottom-Line Invoice Processing (finalTotal)
----------------------------------------------------------
The absolute calculation sequence utilized to determine the final payment amount.

Formulas:
itemDiscountsSum = Sum of all individual item.discount values in the cart
itemAdvancesSum  = Sum of all individual item.advance values in the cart

Total Deductions = itemDiscountsSum + state.extraDiscount
Total Prepayments = itemAdvancesSum + state.advance

Final Invoice Total = Subtotal - Total Deductions - Total Prepayments - exchangeValue


-------------------------------------------------------------------------------
4. EXPOSED SYSTEM OUTPUT PROPERTIES REFERENCE MAP
-------------------------------------------------------------------------------
The return signature of useBilling provides values for user components:

[State Properties]
- customer: Active client profile records data object.
- exchangeValue: Registered trade-in material asset valuations.
- cart: Active array reference map containing line item details.
- extraDiscount: Absolute base store-wide discount variable value.
- advance: Standalone payment credits.

[Input Handlers]
- itemInput: Read/write value mapping inputs typed into code scanner forms.
- setItemInput: Directly drives structural form changes.
- isFetching: Boolean flag communicating data load sequences.

[Functional Control Actions]
- setCustomer(payload): Merges partial data parameters into profile objects.
- setExchangeValue(val) / setExtraDiscount(val) / setAdvance(val): Changes global footer values.
- setCart(array): Programmatically updates or overwrites the active cart array.
- removeItem(idx): Deletes a specified cart row index.
- updateItemDetail(idx, section, field, value): Modifies structural values.
- updateNestedDetail(itemIdx, section, detailIdx, field, value): Modifies sub-arrays.
- fetchItem(formEvent): Directly queries inventory data models.
- clearSession(): Erases active data memories and triggers a clean system refresh.

[Live Values Output Engine]
- silverRate / platinumRate / palladiumRate: Formatted numbers for raw store metrics.
- itemDiscountsSum / itemAdvancesSum: Live computational sums across cart rows.
- discount: Computed cumulative system discount output.
- totalAdvance: Computed cumulative prepayments output.
- calculateItemPrice(item): Live consumer visibility pricing function.
- calculateAddons(item): Component evaluation mapping function.
- subTotal: Gross invoice balance before deductions.
- finalTotal: Net total invoice amount due for payment settlement.


-------------------------------------------------------------------------------
5. CORE DEVELOPMENT IMPLEMENTATION GUARDRAILS
-------------------------------------------------------------------------------

1. Optional Chaining Guarantee:
   The structural accumulators use "(state?.cart || [])" to prevent the data 
   engine from crashing during hydration delays or early server-side rendering 
   (SSR) passes before browser session storages resolve.

2. Array Structuring Rule:
   The setCart() pipeline passes payloads directly to the reducer engine. 
   When adding items from external source codes, you must construct and pass 
   the parameter inside a complete array layout instance wrapper.
   
   Bad/Broken Pattern:  setCart(fetchedItemObject)
   Correct/Safe Pattern: setCart([formattedItemObject, ...currentCart])
===============================================================================