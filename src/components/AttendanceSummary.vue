<template>
  <div class="ion-padding" style="text-align: center">
    <p v-if="attendancePercentage >= 80">You have achieved {{ attendancePercentage }}% attendance. Well done!</p>
    <p v-else-if="attendancePercentage === 0">Your attendance percentage will be displayed here.</p>
    <p v-else style="color: red">You have achieved {{ attendancePercentage }}% attendance.
      Attendance below 80% can negatively affect your final grade.</p>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, toRefs, PropType} from "vue";
import {StudentUniversityClass} from "@/model/StudentUniversityClass";

export default defineComponent({
  name: "AttendanceSummary",
  props: {
    previousClasses: {
      type: Array as PropType<Array<StudentUniversityClass>>,
      default: []
    }
  },
  setup(props) {

    const previousClasses = toRefs(props).previousClasses;

    const attendancePercentage = computed(() => {
      let attendedClasses = 0;

      const numberOfClasses = previousClasses.value.length;

      if (numberOfClasses === 0) {
        return 0;
      }

      previousClasses.value.forEach((theClass) => {
        if (theClass.attended) {
          attendedClasses += 1;
        }
      });

      return Math.round((attendedClasses / numberOfClasses) * 100);

    });

    return {attendancePercentage}
  }
});
</script>