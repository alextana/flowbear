<template>
  <header class="w-full py-2 px-4 flex justify-between items-center">
    <NuxtLink to="/">
      <div
        class="logo transform transition-all hover:scale-105 hover:rotate-2 flex gap-2 items-center"
      >
        <UiLogo />
        <div class="text-lg font-semibold">
          flow<span class="font-extrabold">bear</span>
        </div>
      </div>
    </NuxtLink>
    <div class="user-options ml-auto">
      <!-- st: {{ status }} data: {{ data }} -->
      <div v-if="status === 'unauthenticated'">
        <UiButton kind="primary" size="sm" @click="signIn('google')"
          >sign in</UiButton
        >
      </div>
      <div v-if="status === 'loading'">loading..</div>
      <div class="flex items-center gap-2" v-else-if="data">
        <UiAvatar :url="data.user.image" width="30" />
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
