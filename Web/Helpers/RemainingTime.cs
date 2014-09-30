using System;

namespace Web.Helpers
{
    //http://maran.ro/2012/04/19/helper-c-pentru-timpul-ramas/
    public static class RemainingTime
    {
        static readonly DateTime yearEnd = new DateTime(2042, 12, 31);
        public static long Ticks()
        {
            return yearEnd.Ticks - DateTime.Now.Ticks; //9541706833865911    
        }
        public static long Seconds()
        {
            TimeSpan remainingSeconds = new TimeSpan(Ticks());
            return (long)remainingSeconds.TotalSeconds; //954170683           
        }
        public static long Minutes()
        {
            TimeSpan remainingSeconds = new TimeSpan(Ticks()); //15902844            
            return (long)remainingSeconds.TotalMinutes;
        }
        public static long Hours()
        {
            TimeSpan remainingSeconds = new TimeSpan(Ticks());
            return (long)remainingSeconds.TotalHours; //265047              
        }
        public static long Days()
        {
            TimeSpan remainingSeconds = new TimeSpan(Ticks());
            return (long)remainingSeconds.TotalDays; //11043               
        }
    }
}