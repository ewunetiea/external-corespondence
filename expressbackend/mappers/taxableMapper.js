function mapTaxables(rows) {
  return rows.map(row => ({
    id: row.id,
    mainGuid: row.mainGuid,

    initiator_branch: row.initiator_branch,
    destination_branch: row.destination_branch,

    taxCategory: row.taxCategory,
    noOfEmployee: row.noOfEmployee,
    taxableAmount: row.taxableAmount,
    taxWithHold: row.taxWithHold,
    incometaxPoolAmount: row.incometaxPoolAmount,

    graduatetaxPool: row.graduatetaxPool,
    graduaTotBasSalary: row.graduaTotBasSalary,
    graduateTotaEmployee: row.graduateTotaEmployee,
    graduatetaxWithHold: row.graduatetaxWithHold,

    taxCategoryList: row.taxCategoryList,

    maker_name: row.maker_name,
    maker_date: row.maker_date,

    checker_name: row.checker_name,
    checked_Date: row.checked_Date,

    updated_user_name: row.updated_user_name,
    updated_event_date: row.updated_event_date,

    from_List: row.from_List,
    sendTo_List: row.sendTo_List,
    Category_List: row.Category_List,

    status: row.status,
    reference_number: row.reference_number,
    remark: row.remark,

    drafted_date: row.drafted_date,
    approved_date: row.approved_date,

    checker_rejected_reason: row.checker_rejected_reason,
    approver_rejected_reason: row.approver_rejected_reason,
    checker_rejected_date: row.checker_rejected_date,
    approver_rejected_date: row.approver_rejected_date
  }));
}

module.exports = { mapTaxables };
