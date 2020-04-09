import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

export function PostBottomButtons(props) {
  return (
    <nav>
      <Link to={props.contextPath + '/list'}>
        <Button bsStyle="success" className="listBtn">
          <i className="icon-list" />
          List
        </Button>
      </Link>
      <Link to={props.contextPath + '/write'}>
        <Button bsStyle="success" className="writeBtn">
          <i className="icon-doc-new" />
          Write
        </Button>
      </Link>
      <Button bsStyle="success" className="writeBtn" onClick={props.editPost}>
        <i className="icon-pencil" />
        Edit
      </Button>
    </nav>
  )
}
