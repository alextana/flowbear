<template>
  <dialog id="delete_modal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>

      <h3 class="font-bold text-lg">
        <slot name="title"></slot>
      </h3>
      <p class="py-4">
        <slot name="body"></slot>
      </p>
      <div class="buttons flex gap-2 justify-end">
        <slot name="buttons"></slot>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
