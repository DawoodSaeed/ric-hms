import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'waitingTime',
})
export class WaitingTimePipe implements PipeTransform {
  transform(checkInTime: string): string {
    console.log(checkInTime);
    if (!checkInTime) return '-';

    const checkIn = new Date(checkInTime).getTime();
    const now = new Date().getTime();

    if (checkIn > now) {
      return '0m';
    }

    const diffMs = now - checkIn;
    const diffMins = Math.floor(diffMs / 60000);
    const days = Math.floor(diffMins / 1440); // 1440 mins in a day
    const hours = Math.floor((diffMins % 1440) / 60);
    const mins = diffMins % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  }
}
