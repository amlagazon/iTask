import React, { PropTypes } from 'react'
import { Link, Router } from 'react-router';
import Base from "../../../global/components/BaseComponent.js.jsx";
import moment from 'moment';
import { browserHistory } from 'react-router';

class AdminUserListItem extends Base {
  constructor(props) {
    super(props);
  }

  _goToUser(userId) {
    // console.log("this.context");
    // console.log(this.context);
    browserHistory.push(`/admin/users/${userId}`)
  }
  render() {
    const {user} = this.props;
    const modified =  moment(user.updated).calendar();
    return (
      <tr className="linkable" onClick={this._goToUser.bind(this, user._id)}>
        <td>{user.firstName} {user.lastName}</td>
        <td>{user.username}</td>
        <td className="">{user.roles}</td>
        <td className="numbers">{modified}</td>
      </tr>
    )
  }
}

AdminUserListItem.propTypes = {
  user: PropTypes.object.isRequired
}

export default AdminUserListItem;