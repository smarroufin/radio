<script setup lang="ts">
const audioRef = useTemplateRef('audio')
const { stream, playing, pending: playerPending, volume, muted, init: initPlayer, togglePlay, toggleMute, turnUpVolume, turnDownVolume } = usePlayer()

onMounted(() => {
  nextTick(() => {
    initPlayer(audioRef.value!)
  })
})

defineShortcuts({
  k: () => togglePlay(),
  m: () => toggleMute(),
  arrowup: () => turnUpVolume(),
  arrowdown: () => turnDownVolume(),
})
</script>

<template>
  <nav class="sticky bottom-0 z-50 bg-neutral-950 border-t border-neutral-900">
    <UContainer class="flex items-center gap-2 h-12">
      <div class="flex-1 min-w-0 flex justify-end">
        <span class="text-sm font-medium truncate">{{ stream?.name || 'No stream selected' }}</span>
      </div>

      <div>
        <UTooltip
          :text="playing ? 'Pause' : 'Play'"
          :kbds="['K']"
        >
          <UButton
            :icon="playing ? 'i-carbon-pause' : 'i-carbon-play'"
            :aria-label="playing ? 'Pause' : 'Play'"
            :loading="playerPending"
            :disabled="!stream"
            size="xl"
            :ui="{ base: 'rounded-full' }"
            @click="togglePlay()"
          />
        </UTooltip>
      </div>

      <div class="flex-1 min-w-0 flex items-center gap-2">
        <UTooltip
          :text="muted ? 'Unmute' : 'Mute'"
          :kbds="['M']"
        >
          <UButton
            :icon="muted ? 'i-carbon-volume-mute' : 'i-carbon-volume-up'"
            :aria-label="muted ? 'Unmute' : 'Mute'"
            :ui="{ base: 'rounded-full' }"
            size="sm"
            @click="toggleMute()"
          />
        </UTooltip>
        <UTooltip
          text="Volume"
          :kbds="['↑', '↓']"
        >
          <USlider
            v-model="volume"
            :min="0"
            :max="1"
            :step="0.01"
            class="max-w-[110px]"
          />
        </UTooltip>
      </div>
    </UContainer>

    <audio
      ref="audio"
      :src="stream?.url_resolved"
      class="hidden"
      tabindex="-1"
    />
  </nav>
</template>
