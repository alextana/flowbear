<template>
  <header class="w-full py-4 px-4 flex justify-between items-center">
    <div class="logo text-2xl italic font-extrabold">flowbear</div>
    <div class="user-options ml-auto">
      <!-- st: {{ status }} data: {{ data }} -->
      <div v-if="status === 'unauthenticated'">
        <UiButton kind="primary" size="sm" @click="signIn('google')"
          >sign in</UiButton
        >
      </div>
      <div v-if="status === 'loading'">loading..</div>
      <div class="flex items-center gap-2" v-else-if="data">
        <UiAvatar :url="data.user.image" width="40" />
        <button @click="signOut()">
          <Icon name="mdi:logout" size="24" class="hover:text-green-500" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
const { status, data, signIn, signOut } = useAuth()
</script>
