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
    },
  },
};
</script>
