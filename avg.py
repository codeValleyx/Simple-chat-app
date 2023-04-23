nums= input().split(" ");
nums = [ele for ele in nums if ele!='' and ele!=' ']

sum=0;
correct=1;

for x in nums:
    try:
        sum+= eval(x);
    except:
        print("0.000000000")
        correct=0;

if correct==1:
    print("average: ",sum/len(nums));