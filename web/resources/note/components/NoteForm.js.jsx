/**
 * Reusable stateless form component for Note
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import form components
import { TextInput } from '../../../global/components/forms';

const  NoteForm = ({
  formType
  , handleFormChange
  , handleFormSubmit
  , note
}) => {

  // set the button text
  const buttonText = formType === "create" ? "Add Comment" : "Update Comment";

  return (
    <form onSubmit={handleFormSubmit} style={{marginLeft: "-10px"}}>
      <TextInput
        change={handleFormChange}
        name="note.content"
        placeholder="Add a comment"
        value={note.content}
      />
      <div className="input-group">
        <div className="yt-row space-between">
          <button className="yt-btn " type="submit" > {buttonText} </button>
        </div>
      </div>
    </form>
  )
}

NoteForm.propTypes = {
  formType: PropTypes.string.isRequired
  , handleFormChange: PropTypes.func.isRequired
  , handleFormSubmit: PropTypes.func.isRequired
  , note: PropTypes.object.isRequired,
}

NoteForm.defaultProps = {
  formHelpers: {}
  , formTitle: ''
}

export default NoteForm;
