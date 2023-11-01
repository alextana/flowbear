<template>
  <div
    class="w-screen text-center h-screen grid place-content-center container mx-auto"
  >
    <h1 class="text-7xl font-extrabold">Notelap</h1>
    <p class="mt-2">Marketing page coming soon</p>
    <UiSeparator class="my-4" />
    <div class="sign-in text-center mx-auto">
      <div v-if="status === 'unauthenticated'">
        <UiButton kind="primary" @click="signIn('google')">sign in</UiButton>
      </div>
    </div>
  </div>
</template>
<script setup>
const { status, data, signIn, signOut } = useAuth()

definePageMeta({
  layout: 'marketing',
})
</script>
