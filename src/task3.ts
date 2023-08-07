// pad zero
function pad(num, size) {
  var s = '00' + num;
  return s.substring(s.length - size);
}

function parseTimeToMinutes(timeString: string) {
  const parts = timeString.split(':');
  const unitInMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  return unitInMinutes;
}

function parseMinutesToTime(unitInMinutes: number) {
  const hour = Math.floor(unitInMinutes / 60);
  const minute = unitInMinutes % 60;
  return `${pad(hour, 2)}:${pad(minute, 2)}`;
}

function tryScheduleMeeting(schedules: string[][][], duration: number) {
  const mergedSchedule = schedules.flatMap((person) =>
    person.map((schedule) => schedule.map((s) => parseTimeToMinutes(s)))
  );
  mergedSchedule.sort((a, b) => a[0] - b[0]);

  const dayStartTime = parseTimeToMinutes('09:00');
  const firstMeetingStartTime = mergedSchedule[0][0];

  if (dayStartTime + duration <= firstMeetingStartTime) {
    return parseMinutesToTime(dayStartTime);
  }

  let overlapEndTime = mergedSchedule[0][1];

  for (let i = 1; i < mergedSchedule.length; i++) {
    const [firstStart, firstEnd] = mergedSchedule[i - 1];
    const [secondStart, secondEnd] = mergedSchedule[i];

    if (firstEnd >= secondStart) {
      overlapEndTime = Math.max(firstEnd, secondEnd, overlapEndTime);
      continue;
    }

    if (overlapEndTime + duration <= secondStart) {
      return parseMinutesToTime(overlapEndTime);
    } else {
      overlapEndTime = secondEnd;
    }
  }

  const dayEndTime = parseTimeToMinutes('19:00');
  const lastMeetingEndTime = mergedSchedule[mergedSchedule.length - 1][1];

  if (lastMeetingEndTime + duration <= dayEndTime) {
    return parseMinutesToTime(lastMeetingEndTime);
  }

  return null;
}

export default function task3() {
  const schedules = [
    [
      ['09:00', '11:30'],
      ['13:30', '16:00'],
      ['16:00', '17:30'],
      ['17:45', '19:00'],
    ],
    [
      ['09:15', '12:00'],
      ['14:00', '16:30'],
      ['17:00', '17:30'],
    ],
    [
      ['11:30', '12:15'],
      ['15:00', '16:30'],
      ['17:45', '19:00'],
    ],
  ];
  const duration = 60;

  const result = tryScheduleMeeting(schedules, duration);
  console.assert(result === '12:15');
}
