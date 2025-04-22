import React from 'react'
import './list.scss'
import Card from '../card/Card'

function List({ posts, showStatus = false , showActions = false }) {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card key={item.id} item={item} showStatus={showStatus} showActions={showActions} />
      ))}
    </div>
  );
}


export default List
