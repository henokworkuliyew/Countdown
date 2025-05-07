import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Graduation Events
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            All the important dates and events leading up to our graduation day.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="upcoming" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            <Suspense fallback={<EventsLoading />}>
              <div className="space-y-6">
                <EventCard
                  title="Graduation Rehearsal"
                  date="July 13, 2025"
                  time="10:00 AM - 12:00 PM"
                  location="Main Auditorium, Bahirdar University"
                  description="Mandatory rehearsal for all graduating students. Learn the procession order and ceremony protocols."
                  attendees={120}
                />

                <EventCard
                  title="Cap & Gown Distribution"
                  date="July 14, 2025"
                  time="9:00 AM - 4:00 PM"
                  location="Student Center, Room 201"
                  description="Pick up your graduation cap, gown, and other ceremonial items. Bring your student ID."
                  attendees={135}
                />

                <EventCard
                  title="Graduation Ceremony"
                  date="July 15, 2025"
                  time="9:00 AM - 12:00 PM"
                  location="Main Auditorium, Bahirdar University"
                  description="The official graduation ceremony for the Computer Science Department Class of 2025."
                  attendees={150}
                  isHighlighted={true}
                />

                <EventCard
                  title="Class Reunion"
                  date="July 16, 2025"
                  time="6:00 PM - 10:00 PM"
                  location="Blue Nile Hotel, Bahir Dar"
                  description="Celebrate with your classmates at this reunion dinner. Formal attire required."
                  attendees={95}
                />

                <EventCard
                  title="Farewell Party"
                  date="July 17, 2025"
                  time="8:00 PM - 1:00 AM"
                  location="Lakeside Resort, Bahir Dar"
                  description="Join us for a casual farewell party to celebrate our graduation and future endeavors."
                  attendees={110}
                />
              </div>
            </Suspense>
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            <div className="space-y-6">
              <EventCard
                title="Final Project Presentations"
                date="June 10, 2025"
                time="9:00 AM - 5:00 PM"
                location="CS Department, Room 101"
                description="Final year project presentations to faculty and industry representatives."
                attendees={138}
                isPast={true}
              />

              <EventCard
                title="Career Fair"
                date="June 5, 2025"
                time="10:00 AM - 4:00 PM"
                location="Student Center, Main Hall"
                description="Meet potential employers and explore career opportunities after graduation."
                attendees={125}
                isPast={true}
              />

              <EventCard
                title="Pre-Graduation Workshop"
                date="May 25, 2025"
                time="2:00 PM - 5:00 PM"
                location="CS Department, Room 205"
                description="Workshop on resume building, interview skills, and post-graduation opportunities."
                attendees={115}
                isPast={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface EventCardProps {
  title: string
  date: string
  time: string
  location: string
  description: string
  attendees: number
  isHighlighted?: boolean
  isPast?: boolean
}

function EventCard({
  title,
  date,
  time,
  location,
  description,
  attendees,
  isHighlighted = false,
  isPast = false,
}: EventCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all ${
        isHighlighted ? 'border-blue-600 shadow-lg' : ''
      } ${isPast ? 'opacity-80' : ''}`}
    >
      {isHighlighted && (
        <div className="bg-blue-600 text-white text-center py-1 text-sm font-medium">
          Main Event
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Join {attendees} of your classmates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium">{date}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-500">{time}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <p>{location}</p>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-600 mt-0.5" />
            <p>{attendees} attendees</p>
          </div>

          <p className="text-gray-700">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        {isPast ? (
          <Button variant="outline" disabled>
            Event Passed
          </Button>
        ) : (
          <>
            <Button variant="outline">Add to Calendar</Button>
            <Button>RSVP</Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

function EventsLoading() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-5 w-5 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-5 w-5 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded"></div>
              </div>

              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            <div className="h-9 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
