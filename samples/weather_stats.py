"""Weather statistics from daily readings.

Shows: decorators, dataclasses, type hints, f-strings, comprehensions.
"""

from __future__ import annotations

import statistics
from dataclasses import dataclass, field
from datetime import date
from functools import lru_cache
from typing import Iterable

FREEZING_C = 0.0
HOT_C = 30.0


@dataclass(frozen=True)
class Reading:
    day: date
    high_c: float
    low_c: float
    rain_mm: float = 0.0
    tags: tuple[str, ...] = field(default_factory=tuple)

    @property
    def spread(self) -> float:
        return self.high_c - self.low_c


class WeatherLog:
    def __init__(self, readings: Iterable[Reading] | None = None) -> None:
        self._readings: list[Reading] = list(readings or [])

    def __len__(self) -> int:
        return len(self._readings)

    def add(self, reading: Reading) -> None:
        if reading.low_c > reading.high_c:
            raise ValueError(f"low {reading.low_c} is above high {reading.high_c}")
        self._readings.append(reading)

    def frost_days(self) -> list[date]:
        return [r.day for r in self._readings if r.low_c <= FREEZING_C]

    def summary(self) -> dict[str, float]:
        highs = [r.high_c for r in self._readings]
        return {
            "mean_high": round(statistics.mean(highs), 1),
            "max_high": max(highs),
            "total_rain": sum(r.rain_mm for r in self._readings),
        }


@lru_cache(maxsize=128)
def to_fahrenheit(celsius: float) -> float:
    return celsius * 9 / 5 + 32


def main() -> None:
    log = WeatherLog()
    log.add(Reading(date(2026, 1, 5), high_c=3.5, low_c=-2.0, rain_mm=1.2))
    log.add(Reading(date(2026, 1, 6), high_c=7.0, low_c=1.5, tags=("windy",)))
    log.add(Reading(date(2026, 7, 14), high_c=33.1, low_c=21.4))

    stats = log.summary()
    print(f"Days logged: {len(log)}")
    print(f"Mean high:   {stats['mean_high']}°C ({to_fahrenheit(stats['mean_high']):.1f}°F)")
    print("Frost days:  " + ", ".join(d.isoformat() for d in log.frost_days()))

    hot = any(r.high_c >= HOT_C for r in log._readings)
    print("Heat warning\tyes" if hot else "Heat warning\tno")


if __name__ == "__main__":
    main()
