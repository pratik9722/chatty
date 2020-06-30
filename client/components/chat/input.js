
import React, { useEffect, useRef, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import localTypes from '../../types'
import types from '../../../shared/types.mjs'
import { getEditedMessage } from '../../store/selectors'
import { ChatInput, Input } from '../styled'

const defaultMessage = ''

export default () => {
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const editedMessage = useSelector(getEditedMessage)
  const [ message, setMessage ] = useState(defaultMessage)

  useEffect(() => {
    inputRef.current?.focus()
  })

  useEffect(() => {
    if (editedMessage) {
      setMessage(editedMessage.message)
    }
  }, [editedMessage])

  const onChange = () => {
    setMessage(inputRef.current?.value)
  }

  const onKeyDown = e => {
    if (e.keyCode === 27) {
      if (editedMessage) {
        dispatch({
          type: localTypes.EDITING,
          payload: null
        })
      }
      setMessage(defaultMessage)
    }
  }

  const onKeyPress = e => {
    const message = inputRef.current?.value
    if (e.key === 'Enter' && message) {
      if (editedMessage) {
        batch(() => {
          dispatch({
            type: types.EDIT,
            payload: {
              ...editedMessage,
              message
            }
          })

          dispatch({
            type: localTypes.EDITING,
            payload: null
          })
        })
      } else {
        dispatch({
          type: types.MESSAGE,
          payload: {
            message
          }
        })
      }

      setMessage(defaultMessage)
    }
  }

  return (
    <ChatInput>
      <Input
        editing={editedMessage}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyPress={onKeyPress}
        placeholder="Message"
        ref={inputRef}
        value={message}
      />
    </ChatInput>
  )
}
