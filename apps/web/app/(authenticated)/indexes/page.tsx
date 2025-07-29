import Link from 'next/link';
import { Database, FileText, Search, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CreateIndexSheet from './create-index-sheet';

// Mock data for indexes
const indexes = [
  {
    id: '1',
    name: 'Product Catalog',
    description: 'Search index for all product information, specifications, and inventory data',
    documentCount: 15420,
    lastUpdated: '2024-01-15',
    status: 'active',
    type: 'elasticsearch',
  },
  {
    id: '2',
    name: 'Customer Support',
    description: 'Knowledge base articles, FAQs, and support documentation',
    documentCount: 3280,
    lastUpdated: '2024-01-14',
    status: 'active',
    type: 'vector',
  },
  {
    id: '3',
    name: 'Legal Documents',
    description: 'Contracts, policies, and legal documentation search index',
    documentCount: 892,
    lastUpdated: '2024-01-13',
    status: 'indexing',
    type: 'full-text',
  },
  {
    id: '4',
    name: 'Research Papers',
    description: 'Academic papers, research documents, and scientific publications',
    documentCount: 7650,
    lastUpdated: '2024-01-12',
    status: 'active',
    type: 'semantic',
  },
  {
    id: '5',
    name: 'Marketing Content',
    description: 'Blog posts, marketing materials, and promotional content',
    documentCount: 2340,
    lastUpdated: '2024-01-11',
    status: 'active',
    type: 'hybrid',
  },
  {
    id: '6',
    name: 'Technical Documentation',
    description: 'API docs, technical guides, and developer resources',
    documentCount: 1180,
    lastUpdated: '2024-01-10',
    status: 'maintenance',
    type: 'full-text',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'indexing':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'maintenance':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'elasticsearch':
      return <Search className="h-4 w-4" />;
    case 'vector':
      return <Database className="h-4 w-4" />;
    case 'semantic':
      return <FileText className="h-4 w-4" />;
    default:
      return <Database className="h-4 w-4" />;
  }
};

export default function IndexesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Indexes</h1>
          <p className="text-muted-foreground mt-2">
            Manage your document databases and search indexes
          </p>
        </div>
        <CreateIndexSheet />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {indexes.map((index) => (
          <Link key={index.id} href={`/indexes/${index.id}`}>
            <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(index.type)}
                    <CardTitle className="text-lg">{index.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(index.status)} variant="secondary">
                    {index.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{index.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Documents</span>
                    <span className="font-medium">{index.documentCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">{index.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Updated</span>
                    </div>
                    <span className="font-medium">
                      {new Date(index.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
