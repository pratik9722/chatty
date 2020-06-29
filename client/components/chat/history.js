
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import types from '../../../shared/types.mjs'
import { getHistory, getParticipants, getSelfId } from '../../store/selectors'
import { formatChatTime } from '../../utils'

import {
  ChatHistory,
  Message,
  MessageControls,
  MessageHeader,
  Source,
  Time
} from '../styled'

export default () => {
  const dispatch = useDispatch()
  const historyEndRef = useRef()
  const history = useSelector(getHistory)
  const participants = useSelector(getParticipants)
  const selfId = useSelector(getSelfId)

  useEffect(() => {
    historyEndRef.current?.scrollIntoView()
  })

  const onDelete = id => () => dispatch({
    type: types.DELETE,
    payload: {
      id
    }
  })

  const onEdit = id => () => {

  }

  return (
    <ChatHistory>
      {history.map(({
        from,
        id,
        message,
        when
      }) => (
        <Message key={id}>
          <MessageHeader>
            <Source>{participants[from].name || from}</Source>
            <Time>{formatChatTime(when)}</Time>
            {from === selfId && (
              <MessageControls>
                <div onClick={onEdit(id)}>Edit</div>
                <div onClick={onDelete(id)}>Delete</div>
              </MessageControls>
            )}
          </MessageHeader>
          <div>{message}</div>
        </Message>
      ))}
      <div ref={historyEndRef} />
    </ChatHistory>
  )
}