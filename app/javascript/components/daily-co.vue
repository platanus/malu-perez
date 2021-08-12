<template>
  <div>
    DAILY CO
  </div>
</template>
<script>
import DailyIframe from '@daily-co/daily-js';

export default {
  name: 'DailyCo',
  components: {},
  props: {},
  data() {
    return {
      callObject: null,
      meetingEvents: ['joined-meeting', 'left-meeting', 'error'],
      participantsEvents: ['participant-joined', 'participant-updated', 'participant-left'],
      callItems: {},
    };
  },
  created() {
    this.callObject = DailyIframe.createCallObject();
    this.callObject.join({ url: 'https://maluperez.daily.co/7cwQGQUZsyfF6VVThs2C' });
  },
  computed: {
    meetingState() {
      return Boolean(this.callObject) ? this.callObject.meetingState() : null;
    },
  },
  mounted() {},
  watch: {
    callObject(newCallObject) {
      this.meetingEvents.forEach((event) => {
        newCallObject.on(event, this.handleNewMeetingState);
      });
      this.participantsEvents.forEach((event) => {
        newCallObject.on(event, this.handleNewParticipantsState);
      });
    },
  },
  methods: {
    handleNewMeetingState(event) {
      console.log(`handleNewMeetingState(${event})`);
      console.log(event);
    },
    handleNewParticipantsState(event) {
      console.log(`handleNewParticipantState(${event})`);
      console.log(event);
      this.updateCallItems();
    },

    shouldIncludeScreenCallItem(participant) {
      const trackStatesForInclusion = ['loading', 'playable', 'interrupted'];

      return (
        trackStatesForInclusion.includes(participant.tracks.screenVideo.state) ||
        trackStatesForInclusion.includes(participant.tracks.screenAudio.state)
      );
    },
    updateCallItems() {
      for (const [id, participant] of Object.entries(this.callObject.participants())) {
        this.callItems[id] = {
          videoTrackState: participant.tracks.video,
          audioTrackState: participant.tracks.audio,
        };
        if (this.shouldIncludeScreenCallItem(participant)) {
          this.callItems[`${id}-screen`] = {
            videoTrackState: participant.tracks.screenVideo,
            audioTrackState: participant.tracks.screenAudio,
          };
        }
      }
    },
  },
};
</script>
