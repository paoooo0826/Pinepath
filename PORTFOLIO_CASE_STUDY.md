# Pinepath — Smart Baguio Travel Planner

## Problem

Planning a short visit around Baguio often means juggling separate lists of attractions, maps, weather forecasts and rough cost notes. A list of popular spots alone does not tell a traveler whether the stops fit into a day or a budget.

## Solution

Pinepath brings discovery and itinerary planning into one responsive web app. Visitors choose their trip length, budget, pace and interests. A rule-based planner selects curated places, groups nearby stops, allows time for travel and lunch, and shows an editable daily route with a transparent cost estimate.

## Target users

First-time visitors, weekend travelers, small groups and residents planning a day out in Baguio and nearby Benguet.

## Main features

- Searchable, filterable collection of 35 destinations across Baguio, La Trinidad and nearby Benguet with detail pages and favorites.
- Multi-day itinerary generation and hands-on stop editing.
- Budget categories and cheaper-place suggestions when the estimate exceeds the budget.
- Interactive map with numbered stops and a weather forecast that fails gracefully.
- Device-local trip storage, sharing and a print-friendly itinerary.

## My role

Student developer responsible for product framing, interface design, data modeling, frontend implementation and deployment. This is an independent portfolio project, not a commissioned client system. No real-user adoption or commercial results are claimed.

## Tech stack

React, TypeScript, Vite, Tailwind CSS, React Router, Leaflet, OpenStreetMap, Lucide React and Open-Meteo. The application is a static deployment with browser storage and no paid API key.

## Technical challenges

The original prototype generated short trips from a small list and could repeat stops. V2 separates destination data from the scheduling logic, tracks used places across days, considers distance and conservative visit windows, and recomputes times and costs after edits. Static hosting needed dependable deep links, so the app uses hash routing. Weather and map tiles remain optional network enhancements rather than prerequisites for itinerary generation.

## Design decisions

The visual system uses pine green, cream and warm wood tones to evoke Baguio without a playful travel-app aesthetic. The first page offers a quick planner and the full form supports more deliberate choices. Price labels explicitly say “estimate”; the detail page distinguishes suggested planning windows from verified opening hours. Saved trips remain local so visitors can begin without registration.

## Future improvements

Audit and maintain hours and prices against venue sources; add transit and accessibility data; replace approximate transfer times with a traffic-aware routing provider; commission or license a consistent destination photo set; run usability testing with actual travelers; and add optional account sync if demand justifies it.
