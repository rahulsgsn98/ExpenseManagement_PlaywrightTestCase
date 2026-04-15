/**
 * Option `value`s for Branch Reimbursement → New Submission (`#costcenterid` / Cost Center ID *).
 * Keep in sync with the live dropdown when environments add or remove centers.
 */
export const BRANCH_NEW_SUBMISSION_COST_CENTER_IDS = [
  'S10000B100R00D10',
  'S31900B319R00D11',
  'S13201B132R00D12',
  'S13000B130R00D10'
] as const;

export type BranchNewSubmissionCostCenterId = (typeof BRANCH_NEW_SUBMISSION_COST_CENTER_IDS)[number];

/** Nth configured center for tests (index wraps). */
export function branchNewSubmissionCostCenterAt(index: number): BranchNewSubmissionCostCenterId {
  const ids = BRANCH_NEW_SUBMISSION_COST_CENTER_IDS;
  const i = ((index % ids.length) + ids.length) % ids.length;
  return ids[i]!;
}

/**
 * Choose a value to pass to `<select>`. Uses `preferredId` when it exists in the DOM list,
 * otherwise the first ID from {@link BRANCH_NEW_SUBMISSION_COST_CENTER_IDS} that exists,
 * otherwise the first non-empty option value from the page.
 */
export function resolveBranchNewSubmissionCostCenterId(
  optionValuesFromDom: string[],
  preferredId?: string
): string {
  const nonempty = optionValuesFromDom.map((v) => v.trim()).filter((v) => v.length > 0);
  if (preferredId && nonempty.includes(preferredId)) {
    return preferredId;
  }
  for (const id of BRANCH_NEW_SUBMISSION_COST_CENTER_IDS) {
    if (nonempty.includes(id)) {
      return id;
    }
  }
  if (nonempty.length === 0) {
    throw new Error('No cost center options in dropdown.');
  }
  return nonempty[0]!;
}
