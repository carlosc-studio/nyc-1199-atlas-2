import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  HOSPITALS,
  BOROUGHS,
  NETWORK_COLORS,
  type Hospital,
  type Borough,
  type Network,
} from "@/data/hospitals";
import { HospitalMap } from "@/components/HospitalMap";
import { LineBullets } from "@/components/LineBullet";
import { getCommutes, geocodeAddress } from "@/lib/api/commute.functions";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  MapPin,
  Train,
  Car,
  Home,
  X,
  Pin,
  PinOff,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "1199 NYC Pharmacy Tech Hospital Atlas" },
      {
        name: "description",
        content:
          "Interactive map of every major 1199SEIU-affiliated NYC hospital hiring pharmacy technicians. Filter by borough, subway line, and commute time from your home address.",
      },
      { property: "og:title", content: "1199 NYC Pharmacy Tech Hospital Atlas" },
      {
        property: "og:description",
        content: "Map, neighborhood, subway & commute info for 1199SEIU NYC hospitals.",
      },
    ],
  }),
  component: AtlasPage,
});

type Commute = { transit: number | null; drive: number | null };

function AtlasPage() {
  const [search, setSearch] = useState("");
  const [boroughs, setBoroughs] = useState<Set<Borough>>(new Set());
  const [networks, setNetworks] = useState<Set<Network>>(new Set());
  const [maxCommute, setMaxCommute] = useState<number>(120);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [addressInput, setAddressInput] = useState("");
  const [home, setHome] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [commutes, setCommutes] = useState<Record<string, Commute>>({});

  const geocodeFn = useServerFn(geocodeAddress);
  const commuteFn = useServerFn(getCommutes);

  const allNetworks = useMemo(
    () => Array.from(new Set(HOSPITALS.map((h) => h.network))).sort(),
    [],
  );

  const geocodeMutation = useMutation({
    mutationFn: async (address: string) => geocodeFn({ data: { address } }),
    onSuccess: (res) => {
      if (res.ok) {
        setHome({ lat: res.lat, lng: res.lng, label: res.address });
      }
    },
  });

  const commuteMutation = useMutation({
    mutationFn: async (origin: { lat: number; lng: number }) =>
      commuteFn({
        data: {
          originLat: origin.lat,
          originLng: origin.lng,
          destinations: HOSPITALS.map((h) => ({ id: h.id, lat: h.lat, lng: h.lng })),
        },
      }),
    onSuccess: (res) => {
      const next: Record<string, Commute> = {};
      for (const r of res.results) {
        next[r.id] = { transit: r.transitMinutes, drive: r.driveMinutes };
      }
      setCommutes(next);
    },
  });

  useEffect(() => {
    if (home) commuteMutation.mutate({ lat: home.lat, lng: home.lng });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home?.lat, home?.lng]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return HOSPITALS.filter((h) => {
      if (boroughs.size && !boroughs.has(h.borough)) return false;
      if (networks.size && !networks.has(h.network)) return false;
      if (q) {
        const hay = `${h.name} ${h.neighborhood} ${h.network} ${h.address}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      const c = commutes[h.id];
      if (home && c && c.transit !== null && c.transit > maxCommute) return false;
      return true;
    });
  }, [search, boroughs, networks, commutes, home, maxCommute]);

  const selected = selectedId ? HOSPITALS.find((h) => h.id === selectedId) ?? null : null;
  const pinnedHospitals = HOSPITALS.filter((h) => pinned.has(h.id));

  const togglePin = (id: string) => {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      return next;
    });
  };

  const toggleSet = <T,>(s: Set<T>, v: T, setter: (s: Set<T>) => void) => {
    const next = new Set(s);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setter(next);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Top bar */}
      <header className="flex flex-none items-center gap-3 border-b-2 border-foreground bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="flex h-9 w-9 items-center justify-center bg-foreground font-mono text-sm font-bold text-background"
          >
            1199
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-bold leading-tight tracking-tight">
              NYC PHARMACY TECH ATLAS
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              1199SEIU hospital network · 5 boroughs · {HOSPITALS.length} sites
            </p>
          </div>
        </div>

        <div className="ml-auto flex flex-1 items-center gap-2 md:max-w-3xl">
          <div className="relative flex-1">
            <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && addressInput.trim()) {
                  geocodeMutation.mutate(addressInput.trim());
                }
              }}
              placeholder={home ? home.label : "Your home address (press enter)"}
              className="h-10 rounded-none border-2 border-foreground bg-card pl-9 font-mono text-xs"
            />
          </div>
          {home && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none font-mono text-[10px] uppercase"
              onClick={() => {
                setHome(null);
                setCommutes({});
                setAddressInput("");
              }}
            >
              <X className="mr-1 h-3 w-3" /> Clear
            </Button>
          )}
        </div>
      </header>

      {/* Borough chip rail */}
      <div className="flex flex-none items-center gap-2 overflow-x-auto border-b border-border bg-card px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Boroughs:
        </span>
        {BOROUGHS.map((b) => {
          const active = boroughs.has(b);
          const count = HOSPITALS.filter((h) => h.borough === b).length;
          return (
            <button
              key={b}
              onClick={() => toggleSet(boroughs, b, setBoroughs)}
              className={cn(
                "flex flex-none items-center gap-2 rounded-full border-2 px-3 py-1 font-mono text-xs uppercase tracking-wider transition",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/30 bg-background text-foreground hover:border-foreground",
              )}
            >
              {b}
              <span className="text-[10px] opacity-70">{count}</span>
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hospital, neighborhood…"
              className="h-8 w-56 rounded-none border border-foreground/30 bg-background pl-8 font-mono text-xs"
            />
          </div>
          <button
            className="flex items-center gap-1 border border-foreground/30 px-2 py-1 font-mono text-[10px] uppercase tracking-widest hover:border-foreground"
            onClick={() => setShowFilters((v) => !v)}
          >
            <Filter className="h-3 w-3" /> Filters
          </button>
        </div>
      </div>

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left rail */}
        <aside className="flex w-[420px] flex-none flex-col border-r-2 border-foreground bg-card">
          {showFilters && (
            <div className="flex-none space-y-3 border-b border-border p-4">
              <div>
                <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Hospital network
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {allNetworks.map((n) => {
                    const active = networks.has(n);
                    return (
                      <button
                        key={n}
                        onClick={() => toggleSet(networks, n, setNetworks)}
                        className={cn(
                          "flex items-center gap-1.5 border px-2 py-1 text-[11px] transition",
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background hover:border-foreground",
                        )}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: NETWORK_COLORS[n] }}
                        />
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
              {home && (
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Max transit commute
                    </h3>
                    <span className="font-mono text-xs font-bold">{maxCommute} min</span>
                  </div>
                  <Slider
                    value={[maxCommute]}
                    min={15}
                    max={120}
                    step={5}
                    onValueChange={(v) => setMaxCommute(v[0])}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex-none border-b border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {filtered.length} of {HOSPITALS.length} hospitals
            {commuteMutation.isPending && " · calculating commutes…"}
          </div>

          <ScrollArea className="flex-1">
            <ul className="divide-y divide-border">
              {filtered.map((h) => {
                const c = commutes[h.id];
                const isPinned = pinned.has(h.id);
                const isSelected = selectedId === h.id;
                return (
                  <li
                    key={h.id}
                    className={cn(
                      "cursor-pointer p-4 transition",
                      isSelected ? "bg-accent/30" : "hover:bg-muted",
                    )}
                    onClick={() => setSelectedId(h.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 flex-none rounded-full"
                            style={{ backgroundColor: NETWORK_COLORS[h.network] }}
                          />
                          <h3 className="truncate text-sm font-semibold leading-tight">
                            {h.name}
                          </h3>
                        </div>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {h.borough} · {h.neighborhood}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(h.id);
                        }}
                        className={cn(
                          "flex h-7 w-7 flex-none items-center justify-center border transition",
                          isPinned
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                        )}
                        aria-label={isPinned ? "Unpin" : "Pin to compare"}
                      >
                        {isPinned ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      {h.subway.slice(0, 2).map((s, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <LineBullets lines={s.lines} />
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {s.walkMinutes}m walk
                          </span>
                        </div>
                      ))}
                    </div>

                    {home && c && (
                      <div className="mt-2 flex items-center gap-3 border-t border-dashed border-border pt-2 font-mono text-[11px]">
                        <span className="flex items-center gap-1">
                          <Train className="h-3 w-3" />
                          {c.transit !== null ? `${c.transit} min` : "—"}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Car className="h-3 w-3" />
                          {c.drive !== null ? `${c.drive} min` : "—"}
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="p-8 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  No hospitals match these filters.
                </li>
              )}
            </ul>
          </ScrollArea>
        </aside>

        {/* Map */}
        <main className="relative flex-1 overflow-hidden">
          <HospitalMap
            hospitals={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
            home={home ? { lat: home.lat, lng: home.lng } : null}
            pinnedIds={pinned}
          />
          {/* Network legend */}
          <div className="absolute left-4 top-4 max-w-[240px] border-2 border-foreground bg-card/95 p-3 shadow-lg backdrop-blur">
            <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Network legend
            </h4>
            <ul className="space-y-1">
              {allNetworks.map((n) => (
                <li key={n} className="flex items-center gap-2 text-[11px]">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: NETWORK_COLORS[n] }}
                  />
                  <span className="truncate">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>

      {/* Compare tray */}
      {pinned.size > 0 && (
        <div className="flex-none border-t-2 border-foreground bg-card">
          <button
            onClick={() => setShowCompare((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-2 text-left transition hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <Pin className="h-3.5 w-3.5" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest">
                Compare ({pinned.size}/4)
              </span>
            </div>
            {showCompare ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          {showCompare && (
            <div className="grid max-h-[34vh] overflow-auto border-t border-border" style={{ gridTemplateColumns: `repeat(${Math.max(pinnedHospitals.length, 1)}, minmax(220px, 1fr))` }}>
              {pinnedHospitals.map((h) => {
                const c = commutes[h.id];
                return (
                  <CompareCell
                    key={h.id}
                    h={h}
                    c={c}
                    home={home}
                    onUnpin={() => togglePin(h.id)}
                    onSelect={() => setSelectedId(h.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto border-l-2 border-foreground bg-card sm:max-w-md">
          {selected && (
            <DetailContent
              h={selected}
              c={commutes[selected.id]}
              home={home}
              isPinned={pinned.has(selected.id)}
              onTogglePin={() => togglePin(selected.id)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CompareCell({
  h,
  c,
  home,
  onUnpin,
  onSelect,
}: {
  h: Hospital;
  c?: Commute;
  home: { lat: number; lng: number; label: string } | null;
  onUnpin: () => void;
  onSelect: () => void;
}) {
  return (
    <div className="min-w-0 border-r border-border p-4">
      <div className="flex items-start justify-between gap-2">
        <button onClick={onSelect} className="min-w-0 text-left">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 flex-none rounded-full"
              style={{ backgroundColor: NETWORK_COLORS[h.network] }}
            />
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              {h.network}
            </p>
          </div>
          <h4 className="mt-1 truncate text-sm font-semibold leading-tight">{h.name}</h4>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {h.borough} · {h.neighborhood}
          </p>
        </button>
        <button onClick={onUnpin} className="text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {h.subway[0] && <LineBullets lines={h.subway[0].lines} />}
      </div>
      {home && c ? (
        <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px]">
          <div className="border border-border p-2">
            <dt className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-muted-foreground">
              <Train className="h-2.5 w-2.5" /> Transit
            </dt>
            <dd className="text-base font-bold">
              {c.transit !== null ? `${c.transit}` : "—"}
              <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">min</span>
            </dd>
          </div>
          <div className="border border-border p-2">
            <dt className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-muted-foreground">
              <Car className="h-2.5 w-2.5" /> Drive
            </dt>
            <dd className="text-base font-bold">
              {c.drive !== null ? `${c.drive}` : "—"}
              <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">min</span>
            </dd>
          </div>
        </dl>
      ) : (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Set home address for commute
        </p>
      )}
    </div>
  );
}

function DetailContent({
  h,
  c,
  home,
  isPinned,
  onTogglePin,
}: {
  h: Hospital;
  c?: Commute;
  home: { lat: number; lng: number; label: string } | null;
  isPinned: boolean;
  onTogglePin: () => void;
}) {
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}${home ? `&origin=${home.lat},${home.lng}` : ""}&travelmode=transit`;
  return (
    <div>
      <SheetHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: NETWORK_COLORS[h.network] }}
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {h.network}
          </span>
          <Badge variant="outline" className="rounded-none font-mono text-[9px] uppercase">
            {h.type}
          </Badge>
        </div>
        <SheetTitle className="text-2xl font-bold leading-tight tracking-tight">
          {h.name}
        </SheetTitle>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {h.borough} · {h.neighborhood}
        </p>
      </SheetHeader>

      <div className="mt-5 space-y-5">
        <p className="text-sm leading-relaxed">{h.blurb}</p>

        <div className="flex items-start gap-2 border border-border p-3">
          <MapPin className="mt-0.5 h-4 w-4 flex-none text-muted-foreground" />
          <p className="font-mono text-xs leading-relaxed">{h.address}</p>
        </div>

        {/* Subway */}
        <section>
          <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Nearest subway
          </h3>
          <ul className="space-y-2">
            {h.subway.map((s, i) => (
              <li key={i} className="flex items-center justify-between border-b border-dashed border-border pb-2">
                <div className="flex items-center gap-2">
                  <LineBullets lines={s.lines} />
                  <span className="text-sm font-medium">{s.station}</span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {s.walkMinutes} min walk
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Commute */}
        <section>
          <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Commute from home
          </h3>
          {home && c ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="border-2 border-foreground p-3">
                <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Train className="h-3 w-3" /> Transit
                </div>
                <div className="mt-1 text-3xl font-bold">
                  {c.transit !== null ? c.transit : "—"}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">min</span>
                </div>
              </div>
              <div className="border-2 border-foreground p-3">
                <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Car className="h-3 w-3" /> Drive
                </div>
                <div className="mt-1 text-3xl font-bold">
                  {c.drive !== null ? c.drive : "—"}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">min</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="border border-dashed border-border p-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Set a home address in the top bar to see commute time.
            </p>
          )}
        </section>

        <div className="flex gap-2">
          <Button
            onClick={onTogglePin}
            variant={isPinned ? "default" : "outline"}
            className="flex-1 rounded-none font-mono text-[11px] uppercase tracking-widest"
          >
            {isPinned ? (
              <><Pin className="mr-1.5 h-3.5 w-3.5" /> Pinned</>
            ) : (
              <><PinOff className="mr-1.5 h-3.5 w-3.5" /> Pin to compare</>
            )}
          </Button>
          <a
            href={dirUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 border-2 border-foreground bg-background px-3 py-2 font-mono text-[11px] uppercase tracking-widest hover:bg-foreground hover:text-background"
          >
            Directions <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
