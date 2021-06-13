import {mount} from '@vue/test-utils'
import UpcomingClassItem from '@/components/UpcomingClassItem.vue'
import {StudentUniversityClass} from "@/model/StudentUniversityClass";
import moment from "moment";

describe('UpcomingClassItem.vue', () => {
  it('loads', () => {
    let currentDateTime: string = moment().subtract(5, "minutes").toISOString();
    currentDateTime = currentDateTime.replace('Z', '');
    const inProgressClass = new StudentUniversityClass({
      classId: 'TM4702101',
      name: 'Introduction to TM470',
      location: 'Berrill Lecture Theatre',
      dateTime: currentDateTime,
      duration: 'PT1H',
      classType: 'Lecture',
      module: {
        moduleCode: "TM470",
        moduleYear: "2021",
        moduleName: "The computing and IT project"
      },
      tutor: {
        tutorId: 'dylanb2441',
        forename: 'Bob',
        surname: 'Dylan',
      },
      attended: true

    })

    console.log(inProgressClass.isInProgress());
    console.log(currentDateTime)
    console.log(inProgressClass.datetime.format("DD-MM-YYYY hh:mm a"))

    const wrapper = mount(UpcomingClassItem, {
      props: {
        theClass: inProgressClass,
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
