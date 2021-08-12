<template>
  <div>
    DAILY CO TILE

    <video
      auto-play
      muted
      plays-inline
      :src="videoSrc"
    />
  </div>
</template>
<script>

export default {
  name: 'DailyCoTile',
  components: {},
  props: {
    videoTrackState: { type: Object, default: null },
    audioTrackState: { type: Object, default: null },
    isLocalPerson: { type: Boolean, default: false },
  },
  data() {
    return {};
  },
  computed: {
    videoTrack() {
      const playable = this.videoTrackState && this.videoTrackState.state === 'playable';

      return playable ? this.videoTrackState.track : null;
    },
    audioTrack() {
      const playable = this.audioTrackState && this.audioTrackState.state === 'playable';

      return playable ? this.audioTrackState.track : null;
    },
    videoSrc() {
      return this.videoTrack ? new MediaStream([this.videoTrack]) : null;
    },

  },
  methods: {
  },
  created() {
  },
//   watch() {
//       videoTrack() {
//         this.$refs('videoEl').current.srcObject = new MediaStream([this.videoTrack]);
//       },
//   },
};
</script>
