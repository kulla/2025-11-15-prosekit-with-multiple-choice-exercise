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
      defineExerciseQuestionSpec(),
      defineExerciseAnswersSpec(),
      defineExerciseAnswerSpec(),
      defineBooleanInlineSpec(),
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
      <div className="flex gap-2">
        <button type="button" onClick={handleAddMultipleChoiceExercise}>
          Add MultipleChoiceExercise
        </button>
        <button type="button" onClick={handleAddParagraph}>
          Add Paragraph
        </button>
      </div>
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
    content: 'exerciseQuestion exerciseAnswers',
    group: 'block',
    parseDOM: [{ tag: 'div.multiple-choice-exercise' }],
    toDOM() {
      return ['div', { class: 'multiple-choice-exercise' }, 0]
    },
  })
}

function defineExerciseQuestionSpec() {
  return defineNodeSpec({
    name: 'exerciseQuestion',
    content: 'paragraph+',
    group: 'block',
    parseDOM: [{ tag: 'div.exercise-question' }],
    toDOM() {
      return ['div', { class: 'exercise-question' }, 0]
    },
  })
}

function defineExerciseAnswersSpec() {
  return defineNodeSpec({
    name: 'exerciseAnswers',
    content: 'exerciseAnswer{2,}',
    group: 'block',
    parseDOM: [{ tag: 'div.exercise-answers' }],
    toDOM() {
      return ['div', { class: 'exercise-answers' }, 0]
    },
  })
}

function defineExerciseAnswerSpec() {
  return defineNodeSpec({
    name: 'exerciseAnswer',
    content: 'booleanInline inline+',
    group: 'block',
    parseDOM: [{ tag: 'div.exercise-answer' }],
    toDOM() {
      return ['div', { class: 'exercise-answer' }, 0]
    },
  })
}

function defineBooleanInlineSpec() {
  return defineNodeSpec({
    name: 'booleanInline',
    inline: true,
    group: 'inline',
    atom: true,
    selectable: true,
    parseDOM: [{ tag: 'span.boolean-inline' }],
    toDOM() {
      return ['span', { class: 'boolean-inline' }, '☐']
    },
  })
}
