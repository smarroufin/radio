<template>
  <UContainer
    as="header"
    class="flex items-center justify-between h-12"
  >
    <NuxtImg
      src="/logo.png"
      alt="logo"
      width="32"
      height="32"
      loading="lazy"
    />

    <UButton
      to="https://github.com/smarroufin/radio"
      aria-label="Open on GitHub"
      target="_blank"
      color="neutral"
      variant="ghost"
      icon="i-simple-icons-github"
    />
  </UContainer>
</template>
