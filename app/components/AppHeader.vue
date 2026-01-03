<template>
  <UContainer
    as="header"
    class="flex items-center justify-between h-12"
  >
    <img
      src="/logo.svg"
      alt="logo"
      loading="lazy"
      class="size-8 dark:hidden"
    >
    <img
      src="/logo-white.svg"
      alt="logo"
      loading="lazy"
      class="size-8 hidden dark:block"
    >

    <div class="flex items-center gap-2">
      <AppColorModeToggle />
      <UButton
        to="https://github.com/smarroufin/radio"
        aria-label="Open on GitHub"
        target="_blank"
        color="neutral"
        variant="ghost"
        icon="i-simple-icons-github"
      />
    </div>
  </UContainer>
</template>
