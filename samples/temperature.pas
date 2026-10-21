{ Temperature conversion table.
  Shows: units, records, procedures, functions, arrays, case. }
program TemperatureTable;

uses
  SysUtils;

const
  MinCelsius = -40;
  MaxCelsius = 100;
  Step = 20;

type
  TScale = (Celsius, Fahrenheit, Kelvin);
  TReading = record
    Value: Real;
    Scale: TScale;
  end;

var
  C: Integer;
  Reading: TReading;
  Labels: array[TScale] of string = ('C', 'F', 'K');

function ToFahrenheit(Celsius: Real): Real;
begin
  ToFahrenheit := Celsius * 9 / 5 + 32;
end;

function ToKelvin(Celsius: Real): Real;
begin
  Result := Celsius + 273.15;
end;

procedure PrintReading(const R: TReading);
begin
  Write(Format('%8.2f %s', [R.Value, Labels[R.Scale]]));
end;

(* Classify a Celsius temperature in words. *)
function Describe(Celsius: Integer): string;
begin
  case Celsius of
    -40..-1: Describe := 'freezing';
    0..19:   Describe := 'cold';
    20..29:  Describe := 'pleasant';
  else
    Describe := 'hot';
  end;
end;

begin
  WriteLn('Celsius   Fahrenheit   Kelvin    Feels');
  WriteLn('-------------------------------------------');
  C := MinCelsius;
  while C <= MaxCelsius do
  begin
    Reading.Value := C;
    Reading.Scale := Celsius;
    PrintReading(Reading);

    Reading.Value := ToFahrenheit(C);
    Reading.Scale := Fahrenheit;
    PrintReading(Reading);

    Reading.Value := ToKelvin(C);
    Reading.Scale := Kelvin;
    PrintReading(Reading);

    WriteLn('   ', Describe(C));
    Inc(C, Step);
  end;
end.
