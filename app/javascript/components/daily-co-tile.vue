<template>
  <div>
    {{ this.userId }}
    <video autoPlay muted playsInline :ref="`${this.userId}-video`" />
    <audio autoPlay playsInline :ref="`${this.userId}-audio`" />
  </div>
</template>
<script>

export default {
  name: 'DailyCoTile',
  components: {},
  props: {
    userId: { type: String, default: null },
    videoTrackState: { type: Object, default: null },
    audioTrackState: { type: Object, default: null },
    isLocalPerson: { type: Boolean, default: false },
  },
  data() {
    return {
      // videoTrackState: null,
      // audioTrackState: null,
    };
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
    getVideoComponent() {
      // return videoTrack ? <video autoPlay muted playsInline ref={videoEl} /> : null;
    },
  },
  created() {
  },
  watch: {
    videoTrack(newVideoTrackValue) {
      // debugger;
      this.$refs[`${this.userId}-video`].srcObject = new MediaStream([newVideoTrackValue]);
    },
    audioTrack(newAudioTrackValue) {
      if (!this.isLocalPerson) {
        this.$refs[`${this.userId}-audio`].srcObject = new MediaStream([newAudioTrackValue]);
      }
    },
  },
};
</script>
