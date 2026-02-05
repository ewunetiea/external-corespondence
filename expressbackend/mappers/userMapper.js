const User = require("../models/User");
const Branch = require("../models/Branch");

function mapUsers(rows) {
  return rows.map(row => {
    const user = new User();

    user.id = row.id;
    user.first_name = row.first_name;
    user.middle_name = row.middle_name;
    user.last_name = row.last_name;
    user.username = row.username;
    user.email = row.email;
    user.phone_number = row.phone_number;
    user.status = row.status;
    user.photo_url = row.photo_url;

    if (row.branch_id) {
      const branch = new Branch();
      branch.id = row.branch_id;
      branch.name = row.branch_name;
      branch.code = row.branch_code;
      branch.status = row.branch_status;

      user.branch = branch;
    } else {
      user.branch = null;
    }

    return user;
  });
}

module.exports = { mapUsers };
