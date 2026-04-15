import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>NBA Arena Explorer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Explore NBA teams, arenas, locations, upcoming games, and ticket information.
            </p>
            <Button>Start Exploring</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}