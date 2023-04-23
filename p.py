print("Press 1 to enter distance in km")
print("Press 2 to enter distance in meters")

choice= int(input());

dist= int(input("Enter distance: "))

if choice == 1:
    print("In meters: ",dist*1000)
else:
    print("In kms: ",dist/1000)