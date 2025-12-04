import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import type { City } from "@shared/schema";
import { Loader2, MapPin, Plus, Edit, Trash2 } from "lucide-react";

export default function CitiesAdmin() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  const { data: cities, isLoading } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const [newCity, setNewCity] = useState({
    name: "",
    countryCode: "",
    slug: "",
    lat: 0,
    lng: 0,
    timezone: "UTC",
  });

  const createCityMutation = useMutation({
    mutationFn: async (cityData: typeof newCity) => {
      const response = await apiRequest("POST", "/api/admin/cities", cityData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      toast({
        title: "Success",
        description: "City created successfully",
      });
      setIsAddDialogOpen(false);
      setNewCity({ name: "", countryCode: "", slug: "", lat: 0, lng: 0, timezone: "UTC" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCityMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<City> }) => {
      const response = await apiRequest("PATCH", `/api/admin/cities/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      toast({
        title: "Success",
        description: "City updated successfully",
      });
      setEditingCity(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCityMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/cities/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      toast({
        title: "Success",
        description: "City deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateCity = () => {
    createCityMutation.mutate(newCity);
  };

  const handleUpdateCity = () => {
    if (editingCity) {
      updateCityMutation.mutate({
        id: editingCity.id,
        updates: editingCity,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cities Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage LGBTQ+-friendly cities available on the platform
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rainbow-gradient text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add City
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New City</DialogTitle>
              <DialogDescription>
                Add a new LGBTQ+-friendly city to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="cityName">City Name*</Label>
                <Input
                  id="cityName"
                  value={newCity.name}
                  onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                  placeholder="Barcelona"
                />
              </div>
              <div>
                <Label htmlFor="countryCode">Country Code*</Label>
                <Input
                  id="countryCode"
                  value={newCity.countryCode}
                  onChange={(e) => setNewCity({ ...newCity, countryCode: e.target.value.toUpperCase() })}
                  placeholder="ES"
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug*</Label>
                <Input
                  id="slug"
                  value={newCity.slug}
                  onChange={(e) => setNewCity({ ...newCity, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  placeholder="barcelona"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.000001"
                    value={newCity.lat}
                    onChange={(e) => setNewCity({ ...newCity, lat: parseFloat(e.target.value) || 0 })}
                    placeholder="41.3851"
                  />
                </div>
                <div>
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.000001"
                    value={newCity.lng}
                    onChange={(e) => setNewCity({ ...newCity, lng: parseFloat(e.target.value) || 0 })}
                    placeholder="2.1734"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone*</Label>
                <Input
                  id="timezone"
                  value={newCity.timezone}
                  onChange={(e) => setNewCity({ ...newCity, timezone: e.target.value })}
                  placeholder="Europe/Madrid"
                />
              </div>
              <Button
                onClick={handleCreateCity}
                disabled={createCityMutation.isPending || !newCity.name || !newCity.countryCode || !newCity.slug}
                className="w-full"
              >
                {createCityMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create City"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {cities?.map((city) => (
          <div
            key={city.id}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{city.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-flag"></i>
                      {city.countryCode}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-link"></i>
                      {city.slug}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-clock"></i>
                      {city.timezone}
                    </span>
                  </div>
                  {city.lat && city.lng && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Coordinates: {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog open={editingCity?.id === city.id} onOpenChange={(open) => !open && setEditingCity(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCity(city)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit City</DialogTitle>
                      <DialogDescription>Update city information</DialogDescription>
                    </DialogHeader>
                    {editingCity && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>City Name</Label>
                          <Input
                            value={editingCity.name}
                            onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Country Code</Label>
                          <Input
                            value={editingCity.countryCode}
                            onChange={(e) => setEditingCity({ ...editingCity, countryCode: e.target.value.toUpperCase() })}
                            maxLength={2}
                          />
                        </div>
                        <div>
                          <Label>Slug</Label>
                          <Input
                            value={editingCity.slug}
                            onChange={(e) => setEditingCity({ ...editingCity, slug: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Latitude</Label>
                            <Input
                              type="number"
                              step="0.000001"
                              value={editingCity.lat || 0}
                              onChange={(e) => setEditingCity({ ...editingCity, lat: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label>Longitude</Label>
                            <Input
                              type="number"
                              step="0.000001"
                              value={editingCity.lng || 0}
                              onChange={(e) => setEditingCity({ ...editingCity, lng: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Timezone</Label>
                          <Input
                            value={editingCity.timezone}
                            onChange={(e) => setEditingCity({ ...editingCity, timezone: e.target.value })}
                          />
                        </div>
                        <Button
                          onClick={handleUpdateCity}
                          disabled={updateCityMutation.isPending}
                          className="w-full"
                        >
                          {updateCityMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            "Update City"
                          )}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${city.name}? This action cannot be undone.`)) {
                      deleteCityMutation.mutate(city.id);
                    }
                  }}
                  disabled={deleteCityMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {!cities || cities.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No cities yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first LGBTQ+-friendly city to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
