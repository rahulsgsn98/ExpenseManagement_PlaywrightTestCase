/**
 * Option `value`s for Branch Vendor Payments -> Request Vendor Payment (`#vandorName` / Vendor Name *).
 * Keep in sync with the live dropdown when environments add or remove vendors.
 */
export const BRANCH_VENDOR_PAYMENT_VENDOR_NAMES = [
  'Eleven22 Processing, LLC',
  'Empire Processing',
  'DH Elite Processing'
] as const;

export type BranchVendorPaymentVendorName = (typeof BRANCH_VENDOR_PAYMENT_VENDOR_NAMES)[number];

/** Nth configured vendor for tests (index wraps). */
export function branchVendorPaymentVendorNameAt(index: number): BranchVendorPaymentVendorName {
  const names = BRANCH_VENDOR_PAYMENT_VENDOR_NAMES;
  const i = ((index % names.length) + names.length) % names.length;
  return names[i]!;
}

/**
 * Choose a value to pass to `<select>`. Uses `preferredName` when it exists in the DOM list,
 * otherwise the first value from {@link BRANCH_VENDOR_PAYMENT_VENDOR_NAMES} that exists,
 * otherwise the first non-empty option value from the page.
 */
export function resolveBranchVendorPaymentVendorName(
  optionValuesFromDom: string[],
  preferredName?: string
): string {
  const nonempty = optionValuesFromDom.map((v) => v.trim()).filter((v) => v.length > 0);
  if (preferredName && nonempty.includes(preferredName)) {
    return preferredName;
  }
  for (const name of BRANCH_VENDOR_PAYMENT_VENDOR_NAMES) {
    if (nonempty.includes(name)) {
      return name;
    }
  }
  if (nonempty.length === 0) {
    throw new Error('No vendor options in dropdown.');
  }
  return nonempty[0]!;
}
