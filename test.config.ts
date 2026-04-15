export class TestConfig {
  appUrl = 'https://expense-staging-ccbyhcf2fch9cmgf.eastus-01.azurewebsites.net/';

  // rm -r allure-results     - It clean all the previous tests results

  //valid login credentials- create your own login account
  email = 'Amaan.Ansari@softwarelynx.com';
  password = 'Sgsn@123';

  /**
   * Pipe-separated alternatives for the logged-in employee display name used in E2E assertions
   * (e.g. Details "Submitted By", Edit All Documents "Created By"). Do not hardcode names in specs.
   */
  e2eEmployeeDisplayNameRegexSource = 'Amaan|Ansari';

  /** E2E-EMP-005: search term expected to match at least one history row. */
  e2eHistorySearchMatchKeyword = 'Rahul';

  /** E2E-EMP-005: search term expected to match no rows (empty state). */
  e2eHistorySearchNoMatchKeyword = 'XYZ999';
}