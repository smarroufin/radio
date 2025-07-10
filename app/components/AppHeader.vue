<template>
  <UContainer
    as="header"
    class="flex items-center justify-between h-12"
  >
    <NuxtImg
      src="/logo.svg"
      alt="logo"
      width="32"
      height="32"
      loading="lazy"
      class="dark:hidden"
    />
    <NuxtImg
      src="/logo-white.svg"
      alt="logo"
      width="32"
      height="32"
      loading="lazy"
      class="hidden dark:block"
    />

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
