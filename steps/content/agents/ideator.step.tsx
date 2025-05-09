import { BaseHandle, EventNodeProps, Position } from '@motiadev/workbench'
import React from 'react'

export const Node: React.FC<EventNodeProps> = (props) => {
  return (
    <div className="w-80 bg-black text-white rounded-xl p-4">
      <div className="group relative">
        <BaseHandle type="target" position={Position.Top} variant="event" />

        <div className="flex items-center space-x-3">
          <img className="w-8 h-8" src="https://cdn-icons-png.flaticon.com/512/12222/12222588.png" />
          <div className="text-lg font-semibold">{props.data.name}</div>
        </div>

        <div className="mt-2 text-sm font-medium text-gray-300">{props.data.description}</div>

        <div className="mt-3 flex flex-col gap-2 border border-gray-800 border-solid p-2 rounded-md w-full">
          <div className="flex items-center text-xs text-gray-400 space-x-2">Input</div>
          <div className="flex flex-col gap-2 whitespace-pre-wrap font-mono">
            <div className="flex items-center gap-2">
              <div className="">contentIdea:</div>
              <div className="text-orange-500">string</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="">contentType:</div>
              <div className="text-orange-500">string</div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 border border-gray-800 border-solid p-2 rounded-md w-full">
          <div className="flex items-center text-xs text-gray-400 space-x-2">Output</div>
          <div className="flex flex-col gap-2 whitespace-pre-wrap font-mono">
            <div className="flex items-center gap-2">
              <div className="">topic:</div>
              <div className="text-orange-500">string</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="">subtopics:</div>
              <div className="text-orange-500">string[]</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="">keywords:</div>
              <div className="text-orange-500">string[]</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="">tone:</div>
              <div className="text-orange-500">string</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="">audience:</div>
              <div className="text-orange-500">string</div>
            </div>
          </div>
        </div>

        <BaseHandle type="source" position={Position.Bottom} variant="event" />
      </div>
    </div>
  )
}
