import '@picocss/pico/css/pico.min.css'
import 'prosekit/basic/style.css'
import 'prosekit/basic/typography.css'
import './App.css'

import { defineBasicExtension } from 'prosekit/basic'
import { createEditor } from 'prosekit/core'
import { ProseKit } from 'prosekit/react'
import { useMemo } from 'react'

export default function Editor() {
  const editor = useMemo(() => {
    const extension = defineBasicExtension()
    return createEditor({ extension })
  }, [])

  return (
    <main>
      <h1>Editor</h1>
      <ProseKit editor={editor}>
        <div
          ref={editor.mount}
          className="border-2 rounded-lg p-4"
          spellCheck={false}
        ></div>
      </ProseKit>
    </main>
  )
}
