import React from 'react'
import { InputGroup, Form } from 'react-bootstrap'

export default function WriteOption({
  state,
  deleteContext,
  type,
  handleChange,
  refreshUuid,
  deleteUuid,
  parent,
}) {
  return (
    <React.Fragment>
      <Form.Group className="form_context">
        <Form.Control
          type="text"
          className="context"
          id="context"
          value={state.context}
          onChange={handleChange}
          ref={(ref) => {
            parent.contextinput = ref
          }}
          placeholder="Channel.."
        />
        {state.context && (
          <div
            className="icon-cancel delete"
            onClick={deleteContext}
            title="Delete channel"
          />
        )}
      </Form.Group>
      <Form.Group className="form_uuid">
        <Form.Control
          type="text"
          className="uuid"
          id="uuid"
          value={state.uuid}
          disabled={type === 'edit'}
          ref={(ref) => {
            parent.uuidinput = ref
          }}
          onChange={handleChange}
          placeholder="Uuid.."
        />
        <div className="group_icon">
          <div
            style={
              type === 'edit'
                ? { cursor: 'not-allowed' }
                : { cursor: 'pointer' }
            }
            className="icon-spin3 refresh"
            onClick={refreshUuid}
            title="Generate random uuid"
          />
          {state.uuid && (
            <div
              style={
                type === 'edit'
                  ? { cursor: 'not-allowed' }
                  : { cursor: 'pointer' }
              }
              className="icon-cancel delete"
              onClick={deleteUuid}
              title="Delete uuid"
            />
          )}
        </div>
      </Form.Group>
      <Form.Group className="form_chk">
        <InputGroup>
          <InputGroup.Checkbox
            onChange={handleChange}
            id="isMarkdown"
            checked={state.isMarkdown}
            title="If you check markdown, you can use markdown syntax"
          />
          Markdown
        </InputGroup>
        <InputGroup>
          <InputGroup.Checkbox
            onChange={handleChange}
            id="isPrivate"
            checked={state.isPrivate}
            title="If you check private, the article is not exposed on the list. You can only access the URL directly. If you need to access it again, please keep the post URL separately."
          />
          Private
        </InputGroup>
        <InputGroup>
          <InputGroup.Checkbox
            onChange={handleChange}
            id="hasComment"
            checked={state.hasComment}
            title="If you check comment, you can get comments from others"
          />
          Comment
        </InputGroup>
      </Form.Group>
    </React.Fragment>
  )
}
