      *****************************************************************
      * PAYROLL - computes gross and net pay for a few employees.
      * Shows: divisions, PIC clauses, level numbers, PERFORM loops.
      *****************************************************************
       IDENTIFICATION DIVISION.
       PROGRAM-ID. PAYROLL.
       AUTHOR. PRAGMATIK.

       ENVIRONMENT DIVISION.
       CONFIGURATION SECTION.
       SOURCE-COMPUTER. IBM-370.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  WS-CONSTANTS.
           05  WS-TAX-RATE        PIC V99       VALUE .22.
           05  WS-OVERTIME-RATE   PIC 9V9       VALUE 1.5.
           05  WS-STD-HOURS       PIC 99        VALUE 40.

       01  WS-EMPLOYEE-TABLE.
           05  WS-EMPLOYEE OCCURS 3 TIMES INDEXED BY EMP-IDX.
               10  WS-EMP-NAME    PIC X(20).
               10  WS-EMP-HOURS   PIC 99V9.
               10  WS-EMP-RATE    PIC 999V99.

       01  WS-PAY.
           05  WS-GROSS           PIC 9(5)V99   VALUE ZERO.
           05  WS-NET             PIC 9(5)V99   VALUE ZERO.
           05  WS-OVERTIME-HOURS  PIC 99V9      VALUE ZERO.

       01  WS-DISPLAY-PAY         PIC $$,$$9.99.

       PROCEDURE DIVISION.
       MAIN-PARA.
           PERFORM LOAD-EMPLOYEES
           PERFORM VARYING EMP-IDX FROM 1 BY 1 UNTIL EMP-IDX > 3
               PERFORM COMPUTE-PAY
               PERFORM PRINT-PAY
           END-PERFORM
           STOP RUN.

       LOAD-EMPLOYEES.
           MOVE "ADA LOVELACE"  TO WS-EMP-NAME(1)
           MOVE 42.5            TO WS-EMP-HOURS(1)
           MOVE 31.25           TO WS-EMP-RATE(1)
           MOVE "GRACE HOPPER"  TO WS-EMP-NAME(2)
           MOVE 38.0            TO WS-EMP-HOURS(2)
           MOVE 45.00           TO WS-EMP-RATE(2)
           MOVE "ALAN TURING"   TO WS-EMP-NAME(3)
           MOVE 50.0            TO WS-EMP-HOURS(3)
           MOVE 28.75           TO WS-EMP-RATE(3).

       COMPUTE-PAY.
           IF WS-EMP-HOURS(EMP-IDX) > WS-STD-HOURS
               COMPUTE WS-OVERTIME-HOURS =
                   WS-EMP-HOURS(EMP-IDX) - WS-STD-HOURS
               COMPUTE WS-GROSS ROUNDED =
                   (WS-STD-HOURS * WS-EMP-RATE(EMP-IDX)) +
                   (WS-OVERTIME-HOURS * WS-EMP-RATE(EMP-IDX)
                       * WS-OVERTIME-RATE)
           ELSE
               COMPUTE WS-GROSS ROUNDED =
                   WS-EMP-HOURS(EMP-IDX) * WS-EMP-RATE(EMP-IDX)
           END-IF
           COMPUTE WS-NET ROUNDED = WS-GROSS * (1 - WS-TAX-RATE).

       PRINT-PAY.
           MOVE WS-NET TO WS-DISPLAY-PAY
           DISPLAY WS-EMP-NAME(EMP-IDX) " NET PAY: " WS-DISPLAY-PAY.
