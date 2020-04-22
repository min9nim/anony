import React, { Fragment } from 'react'

export default function PostMenuTemplate(props) {
  const {
    menuClicked,
    postOrigin,
    postDeleted,
    historyCnt,
    listClick,
    historyClick,
    restoreClick,
    editClick,
    deleteClick,
    removeClick,
    dotsClick,
  } = props
  return (
    <div className="postMenu">
      {menuClicked ? (
        <div className="navi">
          {ctx.history.location.pathname.indexOf('/post/') >= 0 && (
            <div className="icon-list" onClick={listClick}>
              List
            </div>
          )}
          {!postOrigin && (
            <div className="icon-history" onClick={historyClick}>
              History{historyCnt}
            </div>
          )}
          {postDeleted ? (
            <div className="icon-ccw" onClick={restoreClick}>
              Restore
            </div>
          ) : (
            <Fragment>
              {!postOrigin && (
                <div className="icon-pencil" onClick={editClick}>
                  Edit
                </div>
              )}
              <div
                className="icon-trash-empty"
                onClick={deleteClick}
                title="Delete this, whenever you can restore this"
              >
                Delete
              </div>
            </Fragment>
          )}
          <div
            className="icon-trash"
            onClick={removeClick}
            title="Delete this, you cannot undo"
          >
            Remove
          </div>
          {/* <div className="icon-cancel" onClick={this.cancelMenu}>Cancel</div> */}
        </div>
      ) : (
        <div className="navi" onClick={dotsClick}>
          ...
        </div>
      )}
    </div>
  )
}
