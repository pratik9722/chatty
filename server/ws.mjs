
import WebSocket from 'ws'

import types from '../shared/types.mjs'

import { broadcastTo, isValidMessage } from './utils.mjs'
import { deserialize, sendTo } from '../shared/utils.mjs'

const participantSockets = new WeakMap()

export const makeWsServer = (
  messageHandlers = {}
) => {
  const wss = new WebSocket.Server({ noServer: true })
  const broadcast = broadcastTo(wss)

  const dispatch = message => {
    const { type, payload } = message
    if (type in messageHandlers) {
      return messageHandlers[type](payload)
    }
  }

  wss.on('connection', ws => {
    const send = sendTo(ws)

    const handleMessage = message => {
      if (!isValidMessage(message)) {
        return
      }

      const from = message.payload?.from
      if (from) {
        participantSockets.set(ws, from)
      }

      broadcast(message)

      const reply = dispatch(message)
      if (reply) {
        send(reply)
      }
    }

    const handleMessageRaw = message => handleMessage(deserialize(message))

    const handleClose = () => {
      const from = participantSockets.get(ws)
      handleMessage({ type: types.LEAVE, payload: { from } })
    }

    ws.on('message', handleMessageRaw)
      .on('close', handleClose)
  })

  return wss
}
