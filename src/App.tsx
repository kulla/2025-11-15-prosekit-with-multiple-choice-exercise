import '@picocss/pico/css/pico.min.css'
import 'prosekit/basic/style.css'
import 'prosekit/basic/typography.css'
import './App.css'

import { defineBasicExtension } from 'prosekit/basic'
import { createEditor, defineNodeSpec, insertNode, union } from 'prosekit/core'
import { ProseKit } from 'prosekit/react'
import { useCallback, useMemo } from 'react'

export default function Editor() {
  const editor = useMemo(() => {
    const extension = union(
      defineBasicExtension(),
      defineMultipleChoiceExerciseSpec(),
    )
    return createEditor({ extension })
  }, [])

  const handleAddMultipleChoiceExercise = useCallback(() => {
    editor.exec(insertNode({ type: 'multipleChoiceExercise' }))
  }, [editor])

  const handleAddParagraph = useCallback(() => {
    editor.exec(insertNode({ type: 'paragraph' }))
  }, [editor])

  return (
    <main>
      <h1>Editor</h1>
      <button type="button" onClick={handleAddMultipleChoiceExercise}>
        Add MultipleChoiceExercise
      </button>
      <button type="button" onClick={handleAddParagraph}>
        Add Paragraph
      </button>
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

function defineMultipleChoiceExerciseSpec() {
  return defineNodeSpec({
    name: 'multipleChoiceExercise',
    content: 'paragraph+',
    group: 'block',
    parseDOM: [{ tag: 'div.multiple-choice-exercise' }],
    toDOM() {
      return ['div', { class: 'multiple-choice-exercise' }, 0]
    },
  })
}
