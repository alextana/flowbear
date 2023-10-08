<template>
  <editor-content :editor="editor" />
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

export default {
  components: {
    EditorContent,
  },

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      editor: null,
    }
  },

  watch: {
    modelValue(value) {
      // HTML
      const isSame = this.editor.getHTML() === value

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    },
  },

  mounted() {
    this.editor = new Editor({
      editorProps: {
        attributes: {
          class: 'mt-8 prose prose-slate w-full min-w-full mx-auto prose-base',
        },
      },
      extensions: [
        StarterKit,
        Highlight,
        Typography,
        Placeholder.configure({
          placeholder: 'Today I...',
        }),
      ],
      content: this.modelValue,
      onUpdate: () => {
        // HTML
        this.$emit('update:modelValue', this.editor.getHTML())

        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>
<!--
<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: 'test',
  },
})

const editor = useEditor({
  editorProps: {
    attributes: {
      class: 'mt-8 prose prose-slate w-full min-w-full mx-auto prose-base',
    },
  },
  content: props.modelValue,
  onUpdate: () => {
    emits('update:modelValue', editor.getHTML())
  },
  extensions: [
    StarterKit,
    Highlight,
    Typography,
    Placeholder.configure({
      placeholder: 'Today I...',
    }),
  ],
})

watch(props.modelValue, (newValue) => {
  const isSame = editor.getHTML() === newValue

  if (isSame) {
    return
  }

  console.log(newValue)

  editor.commands.setContent(newValue, false)
})
</script> -->

<style lang="scss">
/* Basic editor styles */
.tiptap {
  margin: 0;
  padding: 1rem;

  /* border: 1px solid rgba(255, 255, 255, 0.3); */
  border-radius: 0.3rem;
}
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
