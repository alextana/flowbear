<template>
  <editor-content :editor="editor" />
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import { handlePaste } from './utils'
export default {
  components: {
    EditorContent,
  },

  props: {
    autoFocus: {
      type: Boolean,
      default: false,
    },
    classProps: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    placeHolder: {
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

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    },
  },

  mounted() {
    this.editor = new Editor({
      autofocus: this.autoFocus,
      editorProps: {
        handlePaste: handlePaste(this.editor),
        attributes: {
          class: this.classProps || '',
        },
      },
      extensions: [
        StarterKit,
        Highlight,
        Typography,
        Image.configure({
          allowBase64: true,
        }),
        Placeholder.configure({
          placeholder: this.placeHolder || 'Today I...',
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

<style lang="scss">
/* Basic editor styles */
.tiptap {
  margin: 0;
  padding: 1rem;

  /* border: 1px solid rgba(255, 255, 255, 0.3); */
  /* border-radius: 0.3rem; */
}
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
