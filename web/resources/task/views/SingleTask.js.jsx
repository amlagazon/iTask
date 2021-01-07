/**
 * View component for /tasks/:taskId
 *
 * Displays a single task from the 'byId' map in the task reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as taskActions from '../taskActions';
import * as noteActions from '../../note/noteActions';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';

// import resource components
import TaskLayout from '../components/TaskLayout.js.jsx';
import NoteForm from '../../note/components/NoteForm.js.jsx';


class SingleTask extends Binder {
  constructor(props) {
    super(props);
    this.state = {
      showNoteForm: false,
      note: _.cloneDeep(this.props.defaultNote.obj)
    }
    this._bind(
      '_handleFormChange'
      , '_handleNotesSubmit'
    );
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(taskActions.fetchSingleIfNeeded(match.params.taskId));
    dispatch(noteActions.fetchDefaultNote());
    dispatch(noteActions.fetchListIfNeeded('_task', match.params.taskId))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, match } = this.props;
    dispatch(noteActions.fetchListIfNeeded('_task', match.params.taskId));
    this.setState({
      note: _.cloneDeep(nextProps.defaultNote.obj)
    })
  }

  _handleNotesSubmit(e) {
    e.preventDefault();
    const { defaultNote, dispatch, match } = this.props;
    let newNote = {content: this.state.note.content}
    newNote._flow = match.params.flowId;
    newNote._user = window.currentUser._id;
    newNote._task = match.params.taskId;
    dispatch(noteActions.sendCreateNote(newNote)).then(noteRes => {
      console.log(noteRes)
      if(noteRes.success) {
        dispatch(noteActions.invalidateList('_task', match.params.taskId))
        this.setState({
          showNoteForm: false, 
          note: _.cloneDeep(defaultNote.obj)
        })
      } else {
        alert("ERROR - Check logs");
      }
    });
  }

  _handleFormChange(e) {
    /**
     * This let's us change arbitrarily nested objects with one pass
     */
    let newState = _.update(this.state, e.target.name, () => {
      return e.target.value;
    });
    this.setState({newState});
  }

  render() {
    const { taskStore, noteStore, match} = this.props;
    const { note } = this.state;

    /**
     * use the selected.getItem() utility to pull the actual task object from the map
     */
    const selectedTask = taskStore.selected.getItem();

    const noteList = noteStore.lists && noteStore.lists._task ? noteStore.lists._task[match.params.taskId] : null;

    const noteListItems = noteStore.util.getList("_task", match.params.taskId);
    
    const isEmpty = (
      !selectedTask
      || !selectedTask._id
      || taskStore.selected.didInvalidate
    );

    const isFetching = (
      taskStore.selected.isFetching
    )

    const isNoteListEmpty = (
      !noteListItems
      || !noteList
    );

    const isNoteListFetching = (
      !noteListItems
      || !noteList
      || noteList.isFetching
    )

    return (
      <TaskLayout>
        <h3> Single Task </h3>
        { isEmpty ?
          (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          :
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <h1> { selectedTask.name }</h1>
            <p> <em>{selectedTask.description}</em></p>
            <Link to={`${this.props.match.url}/update`}> Update Task </Link>
            <br/>
            { isNoteListEmpty ?
              (isNoteListFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
              :
              <div style={{ opacity: isNoteListFetching ? 0.5 : 1 }}>
                  {noteListItems.map((note, i) =>
                  <div >
                    <hr/>
                    <h4><b>{note._user.username}</b></h4>
                      <p><small>{note.created}</small></p>
                    <div key={note._id + 1}>{note.content}</div>
                    <hr/>
                  </div>
                
                  )}
              </div>
            }
            { note ?
              <NoteForm
                note={note}
                cancelAction={() => this.setState({showNoteForm: false})}
                formTitle="Add Comment"
                formType="create"
                handleFormChange={this._handleFormChange}
                handleFormSubmit={this._handleNotesSubmit}
              />
              : 
              null
            }
          </div>
        }
      </TaskLayout>
    )
  }
}

SingleTask.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    taskStore: store.task,
    noteStore: store.note,
    defaultNote: store.note.defaultItem
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(SingleTask)
);
