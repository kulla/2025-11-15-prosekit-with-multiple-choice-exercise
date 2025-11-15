import '@picocss/pico/css/pico.min.css'
import 'prosekit/basic/style.css'
import 'prosekit/basic/typography.css'
import './App.css'

import type { NodeView } from '@prosekit/pm/view'
import { defineBasicExtension } from 'prosekit/basic'
import {
  createEditor,
  defineNodeSpec,
  defineNodeView,
  insertNode,
  union,
} from 'prosekit/core'
import { ProseKit, useDocChange } from 'prosekit/react'
import { useCallback, useMemo, useState } from 'react'
import { stringify } from 'yaml'

export default function Editor() {
  const editor = useMemo(() => {
    const extension = union(
      defineBasicExtension(),
      defineRootSpec(),
      defineMultipleChoiceExerciseSpec(),
      defineExerciseQuestionSpec(),
      defineExerciseAnswersSpec(),
      defineExerciseAnswerSpec(),
      defineBooleanSpec(),
    )
    return createEditor({ extension })
  }, [])

  const [json, setJson] = useState<unknown>(null)

  const handleAddMultipleChoiceExercise = useCallback(() => {
    editor.exec(
      insertNode({
        type: 'multipleChoiceExercise',
        pos: editor.state.selection.$anchor.after(1),
      }),
    )
  }, [editor])

  const handleAddParagraph = useCallback(() => {
    editor.exec(
      insertNode({
        type: 'paragraph',
        pos: editor.state.selection.$anchor.after(1),
      }),
    )
  }, [editor])

  useDocChange(() => setJson(editor.getDocJSON()), { editor })

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
          className="border-2 rounded-lg p-4 mb-4"
          spellCheck={false}
        ></div>
      </ProseKit>
      <h1>Editor-State</h1>
      <pre>{stringify(json)}</pre>
    </main>
  )
}

function defineRootSpec() {
  return defineNodeSpec({
    name: 'root',
    content: '(paragraph | multipleChoiceExercise)*',
    topNode: true,
  })
}

function defineMultipleChoiceExerciseSpec() {
  return defineNodeSpec({
    name: 'multipleChoiceExercise',
    content: 'exerciseQuestion exerciseAnswers',
    group: 'block',
    splittable: false,
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
    splittable: false,
    parseDOM: [{ tag: 'div.exercise-answers' }],
    toDOM() {
      return ['div', { class: 'exercise-answers' }, 0]
    },
  })
}

function defineExerciseAnswerSpec() {
  return defineNodeSpec({
    name: 'exerciseAnswer',
    content: 'boolean inline*',
    group: 'block',
    splittable: false,
    parseDOM: [{ tag: 'p.exercise-answer' }],
    toDOM() {
      return ['p', { class: 'exercise-answer' }, 0]
    },
  })
}

function defineBooleanSpec() {
  return union(
    defineNodeSpec({
      name: 'boolean',
      inline: true,
      group: 'inline',
      parseDOM: [{ tag: 'input[type="checkbox"]' }],
      toDOM() {
        return ['input', { type: 'checkbox' }]
      },
    }),
    defineNodeView({
      name: 'boolean',
      constructor: () => new BooleanView(),
    }),
  )
}

class BooleanView implements NodeView {
  public dom: HTMLInputElement

  constructor() {
    this.dom = document.createElement('input')
    this.dom.contentEditable = 'false'
    this.dom.type = 'checkbox'
  }

  stopEvent() {
    return false
  }
}
