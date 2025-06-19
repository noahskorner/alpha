import { TypographyH3 } from '@/components/typograhpy/h3';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function OrganizationPage() {
  return (
    <div className="w-full h-full flex flex-col items-center p-8">
      <div className="w-full max-w-7xl">
        <div className="w-full flex flex-col gap-4">
          <TypographyH3>Your organizations</TypographyH3>
          <div>
            <Button size={'sm'} asChild>
              <Link href={'/organizations/create'}>Create organization</Link>
            </Button>
          </div>
          <Link href={'/organizations/1'}>
            <Card className="w-full max-w-sm hover:bg-accent">
              <CardHeader>
                <CardTitle>My organization 1</CardTitle>
                <CardDescription>Enter your email below to login to your account</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
