// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import _ from 'lodash';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';

import * as taskActions from '../../taskActions';

const AdminTaskListItem = ({
  task,
  dispatch
}) => {
  return (
    <tr >
      <td><Link to={`/admin/tasks/${task._id}`}>{task.name}</Link></td>
      <td>{DateTime.fromISO(task.updated).toLocaleString(DateTime.DATETIME_SHORT)}</td>
      <td>{task.complete ? "Completed": "In Progress"}</td>
      <td className="u-textRight">
        <button className={`yt-btn small ${task.complete? "success": "danger"}`} onClick={()=>{
          if(task.complete == null){
            task.complete = false;
          }
          task.complete = !task.complete
          dispatch(taskActions.sendUpdateTask(task)).then(taskRes => {
            if(taskRes.success) {
              console.log("Successful!")
            } else {
              alert("ERROR - Check logs");
            }
          });
          }}>{task.complete? "Completed": "Complete"}</button>
          </td> 
    </tr>
  )
}

AdminTaskListItem.propTypes = {
  task: PropTypes.object.isRequired
}

const mapStoreToProps = (store) => {
  return {
    taskStore: store.task
  }
}
export default withRouter(
  connect(
    mapStoreToProps
  )(AdminTaskListItem)
);